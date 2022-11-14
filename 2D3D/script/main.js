var sw = window.innerWidth;
var sh = window.innerHeight;
var portrait = sh>sw;

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
    numSlotsHorizontal = (sh - (marginLeft*2))/slotWidth;
}

var box = document.createElement("div");
box.style.id = "box";
box.style.border = "1px solid #ccc";
box.style.position = "fixed";
box.style.left = marginLeft+"px";
box.style.top = marginTop+"px";
box.style.width = slotWidth*numSlotsHorizontal+"px";
box.style.height = slotWidth*numSlotsVertical+"px";
document.body.appendChild(box);

var add = document.createElement("button");
add.style.position = "fixed";

var drawItems = function() {
    for (var i = 0; i < numSlotsHorizontal; i++) {
        for (var k = 0; k < numSlotsVerticals;  k++) {
             var item = document.createElement("button");
             item.style.border = "1px solid #ccc";
             item.style.position = "absolute";
             item.style.left = i*slotWidth+"px";
             item.style.top = k*slotWidth+"px";
             item.style.width = slotWidth+"px";
             item.style.height = slotWidth+"px";
             box.appendChild(item);
        }
    }
};

var positionItems = function() {
     
}

$(document).ready(function() {
    drawItems();
});