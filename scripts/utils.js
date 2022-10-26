// v1.2

/**
 * Return Element by ID
 * @param {*} id 
 */
function did(id){ 
    return document.getElementById(id); 
}

/**
 * Return Element with QuerySelector
 * @param {*} id 
 */
function qs(selector){ 
    return document.querySelector(selector); 
}

/**
 * Include File in document Head
 * @param {*} path 
 */
function include(path){
    var imported = document.createElement('script');
    imported.src = path;
    document.head.append(imported);
}

/**
 * Switch class of an Element
 * @param {*} elmt 
 * @param {string} clas 
 */
function sc(elmt,clas){
    if(elmt.classList.contains(clas)){
        elmt.classList.remove(clas);
    }else{
        elmt.classList.add(clas);
    }
}

/**
 * Create, fill and load new dom element in html
 * @param {string} template
 * @param {*} values Object
 * @param {*} spawner DOMElement
 */
function fillAndLoad(template, values, spawner){
    let newtext = template;
    for(let key in values){
        newtext = newtext.replace(new RegExp("\\["+key+"\\]","g"), values[key]);
    }

    let tempdiv = document.createElement("div");
    tempdiv.innerHTML = newtext;
    spawner.appendChild(tempdiv.children[0]);
}


/**
 * It returns a formatted date string based on the type of date you want
 * @param type - hours, date, dateshort, full, fullshort, day, month, timestamp
 * @param [tmstp=false] - timestamp to be used, if false, it will use the current timestamp
 * @returns The current date and time in the format of your choice.
 */
function formateDate(type, tmstp = false){
    var dte = new Date();
    if(tmstp !== false){
        dte = new Date(tmstp);
    }
    if(type == "hours"){
        return ("0"+(dte.getHours())).toString().slice(-2)+":"+("0"+(dte.getMinutes())).toString().slice(-2);

    }else if(type == "date"){
        return ("0"+dte.getDate()).toString().slice(-2)+"/"+("0"+(dte.getMonth()+1)).toString().slice(-2)+"/"+dte.getFullYear();

    }else if(type == "dateshort"){
        return ("0"+dte.getDate()).toString().slice(-2)+"/"+("0"+(dte.getMonth()+1)).toString().slice(-2);

    }else if(type == "full"){
        return ("0"+dte.getDate()).toString().slice(-2)+"/"+("0"+(dte.getMonth()+1)).toString().slice(-2)+"/"+dte.getFullYear()+" "+("0"+(dte.getHours())).toString().slice(-2) +":"+("0"+(dte.getMinutes())).toString().slice(-2);

    }else if(type == "fullshort"){
        return ("0"+dte.getDate()).toString().slice(-2)+"/"+("0"+(dte.getMonth()+1)).toString().slice(-2)+" "+("0"+(dte.getHours())).toString().slice(-2) +":"+("0"+(dte.getMinutes())).toString().slice(-2);
    }else if(type == "day"){
        return ("0"+dte.getDate()).toString().slice(-2);
    }else if(type == "month"){
        return ("0"+(dte.getMonth()+1)).toString().slice(-2);
    }else if(type == "timestamp"){
        return dte.getTime();
    }
}


/**
 * Generate an ID
 * @param {number} length 
 */
function generateID(length){
    var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
    var id = "";
    for(let i=0;i<length;i++){
        let rand = Math.round(Math.random() * 35);
        id += letters[rand];
    }

    return id;
}


/**
 * It sorts an array of arrays by the index of the inner arrays
 * @param array - The array you want to sort
 * @param index - the index of the array you want to sort
 * @param [way=ASC] - "ASC" or "DESC"
 * @returns The array is being sorted by the index value.
 */
 function sort(array, index, way="ASC"){
    if(way == "ASC"){
        return array.sort(function(a,b){return a[index] - b[index]})
    }else if(way == "DESC"){
        return array.sort(function(a,b){return b[index] - a[index]})
    }
    console.error("(utils.js) BAD WAY VALUE");
}