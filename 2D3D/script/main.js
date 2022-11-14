var sw = window.innerWidth;
var sh = window.innerHeight;
var portrait = sh>sw;

var playerId = new Date().getTime();

var items = [
    
];

var marginTop,
    marginLeft, 
    slotWidth, 
    numSlotsHorizontal, 
    numSlotsVertical;

if (portrait) {
    numSlotsHorizontal = 3;
    slotWidth = sw/numSlotsHorizontal;
    marginLeft = 0
    marginTop = (sh % slotWidth)/2;
    numSlotsVertical = (sh - (marginTop*2))/slotWidth;
}
else {
    numSlotsVertical = 20;
    slotWidth = sh/numSlotsHorizontal;
    marginTop = 0
    marginLeft = (sw % slotWidth)/2;
    numSlotsHorizontal = (sw - (marginLeft*2))/slotWidth;
}

var box = document.createElement("div");
box.style.id = "box";
//box.style.border = "2px solid #ccc";
box.style.position = "absolute";
box.style.left = marginLeft+"px";
box.style.top = marginTop+"px";
box.style.width = slotWidth*numSlotsHorizontal+"px";
box.style.height = slotWidth*numSlotsVertical+"px";
document.body.appendChild(box);

var add = document.createElement("button");
add.style.position = "fixed";

var list = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var items = [];
var touchNo = [];
var drawItems = function() {
    for (var i = 0; i < numSlotsVertical; i++) {
        for (var k = 0; k < numSlotsHorizontal;  k++) {
             var item = document.createElement("button");
             item.style.border = "2px solid #ccc";
             item.style.position = "absolute";
             item.style.left = k*slotWidth+"px";
             item.style.top = i*slotWidth+"px";
             item.style.width = slotWidth+"px";
             item.style.height = slotWidth+"px";
             item.style.shadow = "inset 2px 2px rgba(0,0,0,0.5)";
             item.style.fontSize = 
                 (slotWidth/(numSlotsHorizontal-1))+"px";
             item.touchNo = 0;
             item.line = i;
             item.column = k;
             item.onclick = function() {
                  this.touchNo++;
                  this.touchNo = 
                     this.touchNo <= list.length ?
                     this.touchNo : 0;
                  this.innerText = this.touchNo < list.length ?
                  list[this.touchNo] : "null";
                  
             }
             box.appendChild(item);
             items.push(item);
             touchNo.push(this.touchNo);
        }
    }
    loadMap();
};

var loadMap = function() {
    loaded = localStorage.getItem("map");
    if (loaded) {
        touchNo = loaded;
        for (var k in items) {
            items[k].innerText = list[touchNo[k]];
        }
    }
}

var mapFromString = function(str) {
    touchNo = str.split(",");
    for (var k in items) {
        items[k].innerText = list[touchNo[k]];
    }
}

var mapToString = function() {
    var map = "";
    for (var k in items) {
         map += touchNo[k];
         map += k < items.length ? "," : "";
    }
    return map;
}

var sendMap = function() {
    for (var k in items) {
        touchNo[k] = list[items[k].touchNo];
    }
    ws.send(
        "2D3D|"+
        playerId+"|"+mapToString());
};

var saveMap = function() {
    for (var k in items) {
        touchNo[k] = list[items[k].touchNo];
    }
    localStorage.setItem("map", touchNo);
}

var clear = function() {
    for (var k in items) {
        touchNo[k] = 5;
        console.log(k);
        console.log(list[touchNo[k]]);
        items[k].innerText = list[touchNo[k]];
    }
    saveMap();
}

$(document).ready(function() {
    drawItems();
    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        //msg = "2D3D|"+playerId+"|"+0+"|"+0+"|"+1;
        console.log(msg);
        if (msg[0] == "2D3D" &&
            msg[1] != playerId) {
            console.log("received");
            mapFromString(msg[1]);
        }
        saveMap();
    };
});