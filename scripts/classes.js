// jshint esversion: 6

class Path {
    constructor(chemin){
        this.pa = document.createElementNS('http://www.w3.org/2000/svg',"path");
        this.pa.setAttributeNS(null,"stroke",options.color);
        this.pa.setAttributeNS(null,"d",chemin);
        if(isCapsLock){
            this.pa.setAttributeNS(null,"class","dotted");
        }
        // this.pa.onclick = function(e){Path.selectPath(e,this);};

    }

    static selectPath(e,elmt){
        if(selection.item != null){
            selection.item = null;
            selection.mover.remove();
            selection.mover = null;
        }
        var div = new Mover(elmt).div;

        selection.item = elmt;
        selection.mover = div;
        document.body.appendChild(div);

    }
}


class Mover{
    constructor(elmt){
        var pos = elmt.getBoundingClientRect();
        this.div = document.createElement("div");
        this.div.style.top = (window.scrollY + pos.top - 5)+"px";
        this.div.style.left = (window.scrollX + pos.left - 5)+"px";
        this.div.style.width = (pos.width + 10) +"px";
        this.div.style.height = (pos.height + 10)+"px";
        this.div.id = "mover";

    }

}


class Text {
    constructor(x,y){
        this.pa = document.createElementNS('http://www.w3.org/2000/svg',"text");
        this.pa.setAttributeNS(null,"fill",options.color);
        this.pa.setAttributeNS(null,"x",x);
        this.pa.setAttributeNS(null,"y",y);
        // this.pa.onclick = function(e){Path.selectPath(e,this);};

    }

}
