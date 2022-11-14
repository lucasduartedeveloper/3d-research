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
    numSlotsHorizontal = 10;
    slotWidth = sw/10;
    marginLeft = 0
    marginTop = (sh % slotWidth)/2;
    numSlotsVertical = (sh - (marginTop*2))/slotWidth;
}
else {
    numSlotsVertical = 20;
    slotWidth = sh/20;
    marginTop = 0
    marginLeft = (sw % slotWidth)/2;
    numSlotsHorizontal = (sw - (marginLeft*2))/slotWidth;
}

var box = document.createElement("div");
box.style.id = "box";
box.style.border = "2px solid #ccc";
box.style.position = "absolute";
box.style.left = marginLeft+"px";
box.style.top = marginTop+"px";
box.style.width = slotWidth*numSlotsHorizontal+"px";
box.style.height = slotWidth*numSlotsVertical+"px";
document.body.appendChild(box);

var add = document.createElement("button");
add.style.position = "fixed";

var list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var items = [];
var touchNo = [];
var drawItems = function() {
    for (var i = 0; i < numSlotsHorizontal; i++) {
        for (var k = 0; k < numSlotsVertical;  k++) {
             var item = document.createElement("button");
             item.style.border = "2px solid #ccc";
             item.style.position = "absolute";
             item.style.left = i*slotWidth+"px";
             item.style.top = k*slotWidth+"px";
             item.style.width = slotWidth+"px";
             item.style.height = slotWidth+"px";
             item.style.shadow = "inset 2px 2px rgba(0,0,0,0.5)";
             item.touchNo = 0;
             item.line = i;
             item.column = j;
             item.onclick = function() {
                  this.innerText = list[this.touchNo];
                  this.touchNo++;
                  ws.send(
                     "2D3D|"+
                     playerId+"|"+
                     this.line+"|"+
                     this.column+"|"+
                     this.touchNo);
             }
             box.appendChild(item);
             items.push(item);
             touchNo.push(this.touchNo);
        }
    }
    loadMap();
};

var loadMap = function() {
    touchNo = localStorage.getItem("map");
    if (touchNo) {
        for (var k in items) {
            items[k].innerText = list(touchNo[k]);
        }
    }
}

var saveMap = function() {
    for (var k in items) {
        touchNo[k] = list[items[k].touchNo];
    }
    localStorage.setItem("map", touchNo);
}

$(document).ready(function() {
    drawItems();
    ws.onmessage = function(msg) {
        saveMap();
        if (msg[0] == "2D3D" &&
            msg[1] != playerId) {
            var line = parseInt(msg[2]);
            var column = parseInt(msg[3]);
            var touchNo = parseInt(msg[4]);
            items[(line+1)*j].innerHTML = list[touchNo];
        }
    };
});
