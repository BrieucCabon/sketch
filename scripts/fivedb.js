// FiVe DB
// 1.13

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

class FiveDB {

    constructor(db_name, db_version, schema, successCallback = null){
        this.db_name = db_name;
        this.schema = schema;

        var req = indexedDB.open(db_name, db_version);
        self = this;

        req.onsuccess = function () {
            self.db = this.result;
            if(successCallback != null){
                successCallback();
            }
        };

        req.onerror = function (evt) {
            console.error("FiveDB:", evt.target.errorCode);
        };

        req.onupgradeneeded = function (evt) {
            for(let i=0;i<schema.length;i++){
                let table = schema[i];
                let store = evt.currentTarget.result.createObjectStore(
                    table.name,
                    { keyPath: 'id', autoIncrement: true }
                );

                for(let y=0;y<schema[i].fields.length;y++){
                    let field = schema[i].fields[y];
                    store.createIndex(field.name, field.name, { unique: field.unique });
                }
            }
        };

        for(let i=0;i<schema.length;i++){
            let table = schema[i];
            this[table.name] = this.table(table.name);
        }
    }

    /**
     * It returns a new instance of the FiveDBTable class
     * 
     * The FiveDBTable class is defined as follows:
     * @param table - The name of the table you want to access.
     * @returns A new instance of the FiveDBTable class.
     */
    table(table){
        return new FiveDBTable(table,this);
    }

    getObjectStore(store_name, mode) {
        var tx = this.db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }


    /**
     * It logs a message to the console.
     * @param message - The message to be logged.
     * @param [type=error,log,info] - The type of message you want to log.
     */
    static log(message, type="error"){
        console[type]("FiveDB : "+message);
    }

    /**
     * It returns a promise that resolves to a JSON string of the database
     * @param [download=true] - If true, the file will be downloaded. If false, the file will be
     * returned as a string.
     * @param [name] - The name of the file
     * @returns A promise that resolves to a string of JSON.
     */
    export(download = true, name = this.db_name+"-"+new Date().toJSON()){
        return new Promise((resolve) =>{
            var files = [];
            var file = "";
            var done = [];
            for(let i = 0;i<this.schema.length;i++){
                this.table(this.schema[i].name).get().then(res => {
                    done.push(this.schema[i].name);
                    files.push('"'+this.schema[i].name+'":'+JSON.stringify(res));
                    file = files.join(",");
                    file = "{"+file+"}";
                    if(db.schema.map(x => x.name).length == done.length){
                        if(download){
                            var blob = new Blob([file], {"type":"application/json"});
                            var url = URL.createObjectURL(blob);
                            var a = document.createElement("a");
                            a.download = name+".json";
                            a.href = url;
                            a.click();

                        }else{
                            resolve(file);
                        }
                    }
                });
            }
        });

    }

    /**
     * It takes a JSON string and imports it into the database
     * @param str - The JSON string to import
     * @param [callback=null] - The callback function to be called after the import is done.
     * @returns The return value is a boolean.
     */
     import(str){
        return  new Promise(async (resolve) =>{
            var json = "";
    
            if(typeof str == "string"){
                json = JSON.parse(str);
            }else{
                json = str;
            }
            for(var table in json){
                FiveDB.log("Import : "+table,"info");
                for(let i = 0;i<json[table].length;i++){
                    let valeur = {};
                    for(let field in json[table][i]){
                        valeur[field] = json[table][i][field]
                    }
                    await this.table(table).update(valeur);
                }
            }
            resolve();
        });
    }

}

class FiveDBTable{
    constructor(table, db){
        this.table = table;
        this.db = db;
    }


    /**
     * It returns a promise that resolves to the result of a request to get all the records in the
     * table or a single record if the pid is not null.
     * @returns The promise is being returned.
     */
    get(pid = null){
        return new Promise((resolve, reject) =>{
            var store = this.db.getObjectStore(this.table,"readwrite");
            if(pid == null){
                var req = store.getAll();
            }else{
                var req = store.get(pid);   
            }

            req.onsuccess = function(e){
                resolve(e.target.result);
            };
            req.onerror = function(e){
                FiveDB.log(e.target.error.message);
                reject(e.target.error.code);
            };
        });
    }
    
    
    /**
     * It returns a new instance of the FiveDBQuery class.
     * @param index - The index of the row you want to get.
     * @returns A new FiveDBQuery object.
     */
    where(index){
        return new FiveDBQuery(this.table, index, this.db);
    }

    /**
     * It takes an object and adds it to the database.
     * 
     * @param values - The values to be inserted into the database.
     * @returns A promise.
     */
    add(values){

        return new Promise((resolve,reject)=>{
            var store = this.db.getObjectStore(this.table,"readwrite");
            var req;
            var sql={};
            var keys = Object.keys(values);
            for(var i = 0;i<keys.length;i++){
                var c = keys[i];
                var v = values[c];
                sql[c] = v;
            }
            req = store.add(sql);

            req.onsuccess = function(e){
                resolve(e.target.result);
            };
            req.onerror = function(e){
                FiveDB.log(e.target.error.message);
                reject(e.target.error.code);
            };

        });
    }

    /**
     * It deletes the record from the database.
     * @returns A promise.
     */
    delete(pid){
        return new Promise((resolve, reject) => {
            if(pid){
                var store = this.db.getObjectStore(this.table,"readwrite");
                var req = store.delete(pid);
                req.onsuccess = function(e){
                    resolve(true);
                };
                req.onerror = function(e){
                   reject(false);
                };
            }else{
                FiveDB.log("No PID selected for delete");
                reject(false);
            }
        });
    }

    /**
     * It takes an object of key/value pairs, gets the object from the database, updates the object
     * with the key/value pairs, and then puts the object back into the database
     * @param values - The values to update.
     * @returns The promise is being returned.
     */
    update(values, pid = null) {
        return new Promise((resolve, reject)=>{
            if(pid !== null || typeof values.id == "number"){
                if(typeof values.id == "number" && pid === null){
                    pid = values.id;
                }
                this.get(pid).then(data => {
    
                    let keys = Object.keys(values);
    
                    if(data == null){
                        data = values;
                    }else{
                        for(let key of keys){
                            data[key] = values[key];
                        };
                    }
                    
                    var store = this.db.getObjectStore(this.table,"readwrite");
                    var req = store.put(data);
                    req.onsuccess = function(e){
                        resolve(e.target.result);
                    };
                    req.onerror = function(e){
                        FiveDB.log(e.target.error.message);
                        reject(e.target.error.code);
                    };
                });
            }else{
                FiveDB.log("No PID selected for update");
                reject(false);

            }
        });
    }


}

class FiveDBQuery{
    constructor(table, index, db){
        this.table = table;
        this.index = index;
        this.db = db;
    }

    equal(value){
        return this.doRequest(IDBKeyRange.only(value));
    }
    
    up(value, strict = false){
        return this.doRequest(IDBKeyRange.upperBound(value, strict));
    }
    
    low(value, strict = false){
        return this.doRequest(IDBKeyRange.lowerBound(value, strict));
    }
    
    between(valuelow, valuemax, strictlow=false, strictmax=false){
        return this.doRequest(IDBKeyRange.bound(valuelow, valuemax, strictlow, strictmax));

    }
    

    doRequest(operation){

        return new Promise((resolve,reject)=>{
            var store = this.db.getObjectStore(this.table,"readwrite");
            var req = store.index(this.index);
            var rows = [];
            req.openCursor(operation).onsuccess = function(e){
                var cursor = e.target.result;
                if(cursor){
                    rows.push(cursor.value);
                    cursor.continue();
                }else{
                    resolve(rows);
                }
            };

            req.openCursor(operation).onerror = function(e){
                FiveDB.log(e.target.error.message);
                reject(e.target.error.code);
            };
        });
    }
}
