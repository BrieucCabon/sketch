canvas = document.getElementById('canvas');
temp = document.getElementById('temp');

canDraw = isLine = isRect = isCircle = isDelete = false;
points = [];
origin = mouse = tempTextMouse = {};
options = {
    color:"#000",
    zoom : 100,
    mode : 1
};

selection = {
    item: null,
    mover: null
};

tempLoad ="";


temp.onmousedown = function(e){
    if(e.button == 0 && options.mode == 1){
        canDraw = true;
        origin = { x: e.offsetX, y: e.offsetY };
        path = "M"+origin.x+","+origin.y;
        rand1 = Math.floor((Math.random() * 10)-5);
        rand2 = Math.floor((Math.random() * 10)-5);
        rand3 = Math.floor((Math.random() * 15)-7);
        rand4 = Math.floor((Math.random() * 15)-7);
    }

};

temp.onmouseup = function(e){
    if(e.button == 0  && options.mode == 1){
        canDraw = false;
        p1 = origin;
        p2 = points[0];

        var pa = new Path(path).pa;

        canvas.appendChild(pa)
        temp.innerHTML ="";
        points = [];
    }
};

function midPoint(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x)/2,
        y: p1.y + (p2.y - p1.y)/2
    };
}

temp.onmousemove = function(e){

    mouse = { x:e.offsetX , y:e.offsetY };
    if (!canDraw) return;
    var midP;
    if(isLine){
        midP = midPoint(origin, mouse);
        path = "M"+origin.x+","+origin.y+"Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+mouse.x+","+mouse.y;
        temp.innerHTML = '<path d="'+path+'"/>';

    }else if(isRect){
        p1 = {x:origin.x,y:origin.y};
        p2 = {x:mouse.x,y:origin.y};
        midP = midPoint(p1, p2);
        path = "M"+(p1.x+rand3)+","+(p1.y+rand2)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:mouse.x,y:origin.y};
        p2 = {x:mouse.x,y:mouse.y};
        midP = midPoint(p1, p2);
        path += "M"+(p1.x+rand2)+","+(p1.y+rand4)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:mouse.x,y:mouse.y};
        p2 = {x:origin.x,y:mouse.y};
        midP = midPoint(p1, p2);
        path += "M"+(p1.x+rand1)+","+(p1.y+rand3)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:origin.x,y:mouse.y};
        p2 = {x:origin.x,y:origin.y};
        midP = midPoint(p1, p2);
        path += "M"+(p1.x+rand3)+","+(p1.y+rand1)+" Q"+(midP.x+rand2)+","+(midP.y+rand1)+","+p2.x+","+p2.y;

        temp.innerHTML = '<path d="'+path+'"/>';

    }else if(isCircle){

        var midx = origin.x +(mouse.x - origin.x)/2;
        var midy = origin.y +(mouse.y - origin.y)/2;
        path = "M"+origin.x+","+midy+" Q"+origin.x+","+origin.y+","+midx+","+origin.y+" Q"+mouse.x+","+origin.y+","+mouse.x+","+midy+" Q"+mouse.x+","+mouse.y+","+midx+","+mouse.y+" Q"+origin.x+","+mouse.y+","+origin.x+","+midy;
        temp.innerHTML = '<path d="'+path+'"/>';

    }else{
        points.push({x:e.offsetX,y:e.offsetY});
        p1 = origin;
        p2 = points[0];

        path += " M"+p1.x+","+p1.y;
        for(var i=0;i<points.length;i++){
            midP = midPoint(p1, p2);
            path += "Q"+p1.x+","+p1.y+","+midP.x+","+midP.y;
            p1 = points[i];
            p2 = points[i+1];
        }
        temp.innerHTML = '<path d="'+path+'"/>';

    }

};

document.body.onmousewheel = function(e){
    if(isRect){
        e.preventDefault();
        if(e.deltaY == -100){
            zoomIn();
        }else{
            zoomOut();
        }

    }
    // return false;
}

canvas.onmousemove = function(e){
    if(isDelete){
        if(e.path[0].nodeName == "path" || e.path[0].nodeName == "text"){
            e.path[0].remove();
        }
    }
}

canvas.onmousedown = function(e){
    if(options.mode == 0){
        isDelete = true;
        if(e.path[0].nodeName == "path" || e.path[0].nodeName == "text"){
            e.path[0].remove();
        }
    }
}

canvas.onmouseup = function(e){
    if(options.mode == 0){
        isDelete = false;
    }
}

document.body.onkeydown = function(e){
    if(e.keyCode == 16 && !isLine){ isLine = true; }
    if(e.keyCode == 17 && !isRect){ isRect = true; }
    if(e.keyCode == 18 && !isCircle){ isCircle = true; }
    // CTRL + Z
    if(e.keyCode == 90 && e.ctrlKey){ canvas.children[canvas.children.length-1].remove(); }
    // DEL
    if(e.keyCode == 46){
        selection.item.remove();
        selection.mover.remove();
        selection = {item:null,mover:null};
    }
    // Type text
    if(condTextKeyCode(e.keyCode) && !e.ctrlKey && options.mode == 1){

        if(tempTextMouse.x == mouse.x && tempTextMouse.y == mouse.y){
            tempText.innerHTML += e.key;
        }else{
            var txt = new Text(mouse.x,(mouse.y+20)).pa;

            tempText = txt;
            tempTextMouse = mouse;

            txt.innerHTML = e.key;
            canvas.appendChild(txt);
        }

    }
    // Espace
    if(e.keyCode == 32 && (tempTextMouse.x == mouse.x && tempTextMouse.y == mouse.y) && options.mode == 1){
        tempText.innerHTML += e.key;
        e.preventDefault();
        e.stopPropagation();
    }
};

document.body.onkeyup = function(e){
    if(e.keyCode == 16 && isLine){ isLine = false; }
    if(e.keyCode == 17 && isRect){ isRect = false; }
    if(e.keyCode == 18 && isCircle){ isCircle = false; }
};

function condTextKeyCode(code){
    if((code >= 65 && code <= 90) || (code >= 186 && code <= 192) || (code >= 48 && code <= 57) || (code >= 96 && code <= 111)){
        return true;
    }
    return false;
}

function did(id){
    return document.getElementById(id);
}

function toint(size){
    return size.replace("px","");
}


function zoomIn(){
    if(options.zoom == 300) return;
    options.zoom += 20;
    did("zoomLabel").innerHTML = options.zoom+"%";
    did("temp").style.transform = "scale("+ (options.zoom/100)+")";
    did("canvas").style.transform = "scale("+ (options.zoom/100)+")";
}

function zoomOut(){
    if(options.zoom == 40) return;
    options.zoom = options.zoom -20;
    did("zoomLabel").innerHTML = options.zoom+"%";
    did("temp").style.transform = "scale("+ (options.zoom/100)+")";
    did("canvas").style.transform = "scale("+ (options.zoom/100)+")";
}


function changeMode(md){
    options.mode = md;
    var tools = document.getElementsByClassName("tool");
    for(var i = 0;i<tools.length;i++){
        tools[i].classList.remove("active");
    }

    did("canvas").classList.remove("onfront");
    did("colorbar").classList.remove("open");
    did("md"+md).classList.add("active");
    if(md != 3){
        openMenu(0);

    }


    switch (md) {
        case 0:
            did("canvas").classList.add("onfront");
            break;
        case 1:

            break;
        case 2:
            did("colorbar").classList.add("open");
            break;
    }

}

function changeColor(col){
    options.color = col;
    did("palette").style.color = options.color;
    changeMode(1);
}


function save(){
    var blob = new Blob([did('canvas').innerHTML],{ "type" : "text/xml" });
    var url = URL.createObjectURL(blob);
    did('dl').download = did("filename").value+".skt";
    did('dl').href = url;
    did('dl').click();
}
function load(e){

    var fs = e.target.files;
    var fr = new FileReader();

    fr.readAsText(fs[0]);
    fr.onload = function(e){
      tempLoad = e.target.result;
      did("files").classList.add("ok");
      did("btnLoad").classList.remove("sealbtn");
    };

}

function openMenu(act){
    if(act == 1){
        if(did("menuBox").classList.contains("open")){

            did("menuBox").classList.remove("open");
        }else{
            did("menuBox").classList.add("open");
        }
    }else{
        did("menuBox").classList.remove("open");
        did("md3").classList.remove("active");
    }
}

function openSave(){
    openMenu(0);
    if(did("saveBox").classList.contains("open")){
        did("saveBox").classList.remove("open");
    }else{
        did("saveBox").classList.add("open");
    }
}
function openLoad(){
    did("files").classList.remove("ok");

    openMenu(0);
    if(did("loadBox").classList.contains("open")){
        did("loadBox").classList.remove("open");
    }else{
        did("loadBox").classList.add("open");
    }
}

function confirmLoad(){
    did('canvas').innerHTML = tempLoad;
    did("btnLoad").classList.add("sealbtn");
    tempLoad = "";
}
