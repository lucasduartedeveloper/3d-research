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

}

var box = document.body.createElement("div");
box.style.border = "1px solid #ccc";
box.style.position

var add = document.body.createElement("button");
add.style.position = "fixed";

var drawItems = function() {
    for (var k in items) {
         var item = document.body.createElement("button");
         
    }
};

var positionItem = function() {

}