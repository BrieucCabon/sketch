canvas = document.getElementById('canvas');
temp = document.getElementById('temp');

canDraw = isLine = isRect = isCircle = isDelete = isDash = isStraight = isFill = false;
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

perfCount = 0;

tempMouse = null;


temp.onmousedown = function(e){
    if(e.button == 0 && options.mode == 1){
        canDraw = true;
        perfCount = 0;
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

        canvas.appendChild(pa);
        temp.innerHTML ="";
        points = [];
    }
};

function midPoint(p1, p2) {
    return {
        x: Math.round(p1.x + (p2.x - p1.x)/2),
        y: Math.round(p1.y + (p2.y - p1.y)/2)
    };
}

temp.onmousemove = function(e){

    mouse = { x:e.offsetX , y:e.offsetY };
    tempMouse = e;
    if (!canDraw) return;
    var midP;
    var tag = "";
    if(isDash){
        tag = '<path class="dotted" d="';
    }else{
        tag = '<path d="';
    }

    if(isStraight){
        rand1 = 0;
        rand2 = 0;
        rand3 = 0;
        rand4 = 0;
    }
    var m = "M";
    if(isFill){
        m = "L";
    }

    if(isLine){
        midP = midPoint(origin, mouse);
        path = "M"+origin.x+","+origin.y+"Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+mouse.x+","+mouse.y;
        temp.innerHTML = tag+path+'"/>';

    }else if(isRect){
        p1 = {x:origin.x,y:origin.y};
        p2 = {x:mouse.x,y:origin.y};
        midP = midPoint(p1, p2);
        path = "M"+(p1.x+rand3)+","+(p1.y+rand2)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:mouse.x,y:origin.y};
        p2 = {x:mouse.x,y:mouse.y};
        midP = midPoint(p1, p2);
        path += m+(p1.x+rand2)+","+(p1.y+rand4)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:mouse.x,y:mouse.y};
        p2 = {x:origin.x,y:mouse.y};
        midP = midPoint(p1, p2);
        path += m+(p1.x+rand1)+","+(p1.y+rand3)+" Q"+(midP.x+rand1)+","+(midP.y+rand2)+","+p2.x+","+p2.y;

        p1 = {x:origin.x,y:mouse.y};
        p2 = {x:origin.x,y:origin.y};
        midP = midPoint(p1, p2);
        path += m+(p1.x+rand3)+","+(p1.y+rand1)+" Q"+(midP.x+rand2)+","+(midP.y+rand1)+","+p2.x+","+p2.y;

        temp.innerHTML = tag+path+'"/>';

    }else if(isCircle){

        var midx = origin.x +(mouse.x - origin.x)/2;
        var midy = origin.y +(mouse.y - origin.y)/2;
        path = "M"+origin.x+","+midy+" Q"+origin.x+","+origin.y+","+midx+","+origin.y+" Q"+mouse.x+","+origin.y+","+mouse.x+","+midy+" Q"+mouse.x+","+mouse.y+","+midx+","+mouse.y+" Q"+origin.x+","+mouse.y+","+origin.x+","+midy;
        temp.innerHTML = tag+path+'"/>';

    }else if((perfCount % 2) == 0){
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
        temp.innerHTML = tag+path+'"/>';
    }
    perfCount++;

};


document.body.addEventListener("wheel",function(e){
    if(isRect){
        e.preventDefault();
        if(e.deltaY == -100){
            zoomIn();
        }else{
            zoomOut();
        }

    }
}, {passive:false});


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

    // if(e.getModifierState("CapsLock")){
    //     isCapsLock = true;
    //     did("dashLogo").style.display = "inline-block";
    // }else{
    //     isCapsLock = false;
    //     did("dashLogo").style.display = "none";
    // }

    // if(e.keyCode == 222 && isStraight){
    //     isStraight = false;
    //     did("straightLogo").style.display = "none";
    // }else if(e.keyCode == 222 && !isStraight){
    //     isStraight = true;
    //     did("straightLogo").style.display = "inline-block";
    // }

    // refresh mouse pos in temp
    if(e.keyCode == 222 && tempMouse != null){
        temp.onmousemove(tempMouse);
    }

    // if(e.keyCode == 226 && isFill){
    //     isFill = false;
    //     did("fillLogo").style.display = "none";
    // }else if(e.keyCode == 226 && !isFill){
    //     isFill = true;
    //     did("fillLogo").style.display = "inline-block";
    // }

    if(e.keyCode == 16 && !isLine){ isLine = true; }
    if(e.keyCode == 17 && !isRect){ isRect = true; }
    if(e.keyCode == 18 && !isCircle){ isCircle = true; }

    // CTRL + Z
    if(e.keyCode == 90 && e.ctrlKey){ canvas.children[canvas.children.length-1].remove(); }

    // Backspace
    if(e.keyCode == 8){ 
        if(tempTextMouse.x == mouse.x && tempTextMouse.y == mouse.y){
            tempText.innerHTML = tempText.innerHTML.slice(0, -1);
        }
    }

    // DEL
    if(e.keyCode == 46 && options.mode == 1){
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
    if(
        (code >= 65 && code <= 90)   ||
        (code >= 186 && code <= 192) ||
        (code >= 48 && code <= 57)   ||
        (code >= 96 && code <= 111)  ||
        (code >= 219 && code <= 221) ||
        code == 223
    ){
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
    did("toolbar").classList.remove("open");
    did("md"+md).classList.add("active");
    if(md != 3){
        openMenu(0);

    }


    switch (md) {
        case 0:
            did("canvas").classList.add("onfront");
            break;
        case 1:
            did("toolbar").classList.add("open");
            break;
        case 2:
            did("colorbar").classList.add("open");
            break;
    }

}


function changeTool(type){
    if(type == "fill" && !isFill){
        isFill = true;
        did("toolFill").classList.add("selected");
    }else if(type == "fill"){
        isFill = false;
        did("toolFill").classList.remove("selected");
    }

    if(type == "straight" && !isStraight){
        isStraight = true;
        did("toolStra").classList.add("selected");
    }else if(type == "straight"){
        isStraight = false;
        did("toolStra").classList.remove("selected");
    }

    if(type == "dash" && !isDash){
        isDash = true;
        did("toolDash").classList.add("selected");
    }else if(type == "dash"){ 
        isDash = false;
        did("toolDash").classList.remove("selected");
    }
}

function changeColor(col){
    options.color = col;
    did("palette").style.color = options.color;
    changeMode(1);
}


function save(){
    if(did("savetype").selectedIndex == 0){
        var html;
        if(document.getElementsByName("cps")[0].checked){
            html = compress(did('canvas').innerHTML);
        }else{
            html = did('canvas').innerHTML;
        }
        var blob = new Blob([html],{ "type" : "text/xml" });
        var url = URL.createObjectURL(blob);
        did('dl').download = did("filename").value+".skt";
        did('dl').href = url;
        did('dl').click();
    }else if(did("savetype").selectedIndex == 1){
        exportersvg();
    }else{
        if(did("savetype").selectedIndex == 2){
            exporterimg("png");
        }else{
            exporterimg("jpg");
        }
    }
}
function load(e){

    var fs = e.target.files;
    did("filename").value = fs[0].name.split(".")[0];
    var fr = new FileReader();

    fr.readAsText(fs[0]);
    fr.onload = function(e){
      tempLoad = e.target.result;
      did("files").classList.add("ok");
      did("btnLoad").classList.remove("sealbtn");
    };
    localStorage.removeItem("sk_autosave");

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
    did('canvas').innerHTML = uncompress(tempLoad);
    did("btnLoad").classList.add("sealbtn");
    tempLoad = "";
}

function showHelp(){
    if(did("help").classList.contains("active")){
        did("help").classList.remove("active");
    }else{
        did("help").classList.add("active");
    }
}

window.addEventListener("unload",autosave);

function autosave(){
    openMenu(0);
    var value = did("canvas").innerHTML;
    if(value != ""){
        var packValue = compress(value);
        localStorage.setItem("sk_autosave",packValue);
    }
}

function loadAutosave(){
    openMenu(0);
    var packValue = localStorage.getItem("sk_autosave");

    if(packValue != null){
        var value = uncompress(packValue);
        did("canvas").innerHTML = value;
    }
}


function compress(value){
    value = value.replace(/<path/g, "<p");
    value = value.replace(/<\/path>/g, "</p>");
    value = value.replace(/stroke=/g, "st=");
    value = value.replace(/fill=/g, "f=");
    value = value.replace(/<text/g, "<t");
    value = value.replace(/<\/text>/g, "</t>");
    value = value.replace(/steelblue/g, "stb");
    value = value.replace(/indianred/g, "inr");
    value = value.replace(/darkseagreen/g, "dsg");
    return "<<cps>>"+value;
}

function uncompress(value){
    if(value.match(/(<<cps>>)/g) != null){
        value = value.replace(/(<<cps>>)/g, "");
        value = value.replace(/<p/g, "<path");
        value = value.replace(/<\/p>/g, "</path>");
        value = value.replace(/st=/g, "stroke=");
        value = value.replace(/f=/g, "fill=");
        value = value.replace(/<t/g, "<text");
        value = value.replace(/<\/t>/g, "</text>");
        value = value.replace(/stb/g, "steelblue");
        value = value.replace(/inr/g, "indianred");
        value = value.replace(/dsg/g, "darkseagreen");
    }
    return value;
}


function exportersvg(){
    var style;
    if(document.getElementsByName("police")[0].checked){
        style = defs;
    }else{
        style = defslight;
    }
    var svg = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="3840px" height="2160px">'+style+
    did('canvas').innerHTML
    +'</svg>';

    var blob = new Blob([svg],{ "type" : "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.download = did("filename").value+".svg";
    a.href = url;
    a.click();
}

function exporterimg(type){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.innerHTML = defs + did('canvas').innerHTML;

    var data = (new XMLSerializer()).serializeToString(svg);

    var canvas = document.createElement("canvas");
    var marge = 30;
    var bbox = did('canvas').getBBox();
    var ctx = canvas.getContext("2d");

    canvas.width = bbox.width + (2*marge);
    canvas.height = bbox.height + (2*marge);

    var img = new Image();
    img.src = "data:image/svg+xml;base64,"+btoa(data);

    img.onload = function(){
        var tempcan = document.createElement("canvas");
        tempcan.width = 3840 + (2*marge);
        tempcan.height = 2160 + (2*marge);
        var ctx2 = tempcan.getContext("2d");
        if(type == "png" && document.getElementsByName("background")[0].checked){
            ctx2.fillStyle = "transparent";
        }else{
            ctx2.fillStyle = "#ffffff";
        }
        ctx2.fillRect(0, 0, tempcan.width, tempcan.height);
        ctx2.drawImage(img, marge, marge);

        var tempdata = ctx2.getImageData(bbox.x, bbox.y, bbox.width + (2*marge), bbox.height + (2*marge));
        ctx.putImageData(tempdata, 0, 0);

        let url = canvas.toDataURL("image/"+type);
        var a = document.createElement("a");
        a.download = did("filename").value+"."+type;
        a.href = url;
        a.click();
    }

}

function changeSaveType(elmt){
    if(document.getElementsByClassName("optvisible").length > 0){
        document.getElementsByClassName("optvisible")[0].classList.remove("optvisible");
    }
    if(elmt.selectedIndex == 0){
        document.getElementById("skt_option").classList.add("optvisible");
    }else if(elmt.selectedIndex == 1){
        document.getElementById("svg_option").classList.add("optvisible");
    }else if(elmt.selectedIndex == 2){
        document.getElementById("png_option").classList.add("optvisible");
    }else if(elmt.selectedIndex == 3){
        document.getElementById("jpg_option").classList.add("optvisible");
    }
}


var defs = `<defs>
    <style type="text/css">
        @font-face {
            font-family: "Permanent Marker";
            src: url("data:application/font-woff;charset=utf-8;base64,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");
        }
        path{stroke-linejoin: round;stroke-linecap: round;stroke-width:6;fill:none;}
        text {font-family: permanent marker, cursive;font-size: 40px;user-select: none;}.dotted{stroke-dasharray: 20;}

    </style>
</defs>`;

var defslight = `<defs>
    <style type="text/css">
        path{stroke-linejoin: round;stroke-linecap: round;stroke-width:6;fill:none;}
        text {font-family: permanent marker, cursive;font-size: 40px;user-select: none;}.dotted{stroke-dasharray: 20;}
    </style>
</defs>`;
