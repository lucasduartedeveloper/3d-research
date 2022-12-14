var sw = window.innerWidth;
var sh = window.innerHeight;
var portrait = sh>sw;

class BeepPool {
    constructor() {
       this.stored = [];
       this.playing = [];
       this.used = 0;
    }
    play() {
       var beep0 = this.stored.length > 0 ? 
       this.stored.pop() : new Audio("audio/ready-beep.mp3");
       beep0.onended = function() {
           for (var k in this.pool.playing) {
               if (this.timestamp == this.pool.playing[k].timestamp) {
                   this.pool.stored.push(
                       this.pool.playing.splice(k, 1)[0]
                   );
                   this.pool.used += 1;
                   /*info.innerText = "mp3: "+this.pool.used+
                   (this.pool.playing.length > 0 ?
                   "/"+this.pool.playing.length : "");*/
               }
           }
       }
       this.playing.push(beep0);
       beep0.timestamp = new Date().getTime();
       beep0.pool = this;
       beep0.play();
       navigator.vibrate(200);
    }
    empty() {
       this.stored = [];
       this.used = 0;
    }
}
var beepPool = new BeepPool();

var playerId = new Date().getTime();
var items = [];

var marginTop,
    marginLeft, 
    slotWidth, 
    numSlotsHorizontal, 
    numSlotsVertical;

var box = document.createElement("div");
box.style.id = "box";
//box.style.border = "2px solid #ccc";
box.style.position = "absolute";

var calculateSize = function(slots) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    portrait = sh>sw;
    if (portrait) {
        numSlotsHorizontal = slots;
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
    box.style.left = marginLeft+"px";
    box.style.top = marginTop+"px";
    box.style.width = slotWidth*numSlotsHorizontal+"px";
    box.style.height = slotWidth*numSlotsVertical+"px";
    document.body.appendChild(box);
}

var add = document.createElement("button");
add.style.position = "fixed";

var list = 
" 0123456789ABC??DEFGHIJKLMN??OPQRSTUVWXYZ/_.%@??$&+-?";

var items = [];
var touchNo = [];
var pushTime = new Date().getTime();
var pushInterval = false;
var releaseTimeout = false;

var drawItems = function() {
    touchNo = [];
    for (var k in items) {
        items[k].remove();
    }
    items = [];
    for (var i = 0; i < numSlotsVertical; i++) {
        for (var k = 0; k < numSlotsHorizontal;  k++) {
             var item = document.createElement("button");
             item.className = "item";
             item.style.border = "2px solid #ccc";
             item.style.position = "absolute";
             item.style.left = k*slotWidth+"px";
             item.style.top = i*slotWidth+"px";
             item.style.width = slotWidth+"px";
             item.style.height = slotWidth+"px";
             item.style.shadow = "inset 2px 2px rgba(0,0,0,0.5)";
             item.style.lineHeight = "0px";
             item.style.fontSize = (slotWidth)+"px";
             item.touchNo = 0;
             item.line = i;
             item.column = k;
             item.onmousedown = function() {
                 console.log("mousedown");
                 pushTime = new Date().getTime();
                 console.log(pushTime);
                 pushInterval = setInterval(function() {
                     console.log(this);
                     if (new Date().getTime() - pushTime > 2000) {
                         this.onmouseup(false);
                     }
                 }.bind(this), 250);
                 console.log(pushInterval);
             };
             item.onmouseup = function(clear=true) {
                  console.log("interval: "+pushInterval);
                  console.log("time: "+(new Date().getTime() - pushTime));
                  console.log("mouseup");
                  beepPool.play();
                  if (pushInterval && clear) clearInterval(pushInterval);
                  this.touchNo++;
                  this.touchNo = 
                      this.touchNo <= list.length ?
                      this.touchNo : 0;
                  this.innerText = this.touchNo < list.length ?
                  list[this.touchNo] : "null";
                  if (this.touchNo < list.length &&
                      typeof list[this.touchNo] != "undefined") {
                      this.style.fontSize = 
                         (slotWidth)+"px";
                  }
                 else {
                     this.style.fontSize = 
                        (slotWidth/3)+"px";
                 }
                 touchNo[(this.line*numSlotsHorizontal)+
                     this.column] = this.touchNo;
                 sendMap();
                 if (releaseTimeout) clearTimeout(releaseTimeout);
                 releaseTimeout = setTimeout(function() {
                      //say(this.innerText);
                  }.bind(this), 5000);
             }
             box.appendChild(item);
             items.push(item);
             touchNo.push(item.touchNo);
        }
    }
    loadMap();
};

var loadMap = function() {
    $.ajax({
        url: "ajax/database.php",
        method: "POST",
        datatype: "json",
        data: { 
            action: "get-account"
        }
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        //console.log(data);
        loaded = localStorage.getItem("map");
        loaded = json[0].value;
        //console.log(json);
        if (loaded) {
            //console.log(loaded);
            touchNo = mapFromString(loaded);
            for (var k in touchNo) {
                /*console.log(touchNo);
                console.log(k);
                console.log(touchNo[k]);
                console.log(list[touchNo[k]]);*/
                items[k].innerText = list[touchNo[k]];
                if (typeof list[touchNo[k]] != "undefined") {
                    items[k].style.fontSize = 
                    (slotWidth)+"px";
                }
                else {
                    items[k].style.fontSize = 
                    (slotWidth/3)+"px";
                }
            }
        }
    });
}

var mapFromString = function(str) {
    touchNo = str.split(",");
    for (var k in items) {
        items[k].innerText = list[touchNo[k]];
    }
    return touchNo;
}

var mapToString = function() {
    var map = "";
    for (var k in items) {
         map += touchNo[k];
         map += k < items.length-1 ? "," : "";
    }
    return map;
}

var sendMap = function() {
    ws.send(
        "2D3D|"+
        playerId+"|"+mapToString());
    console.log("sent");
};

var saveMap = function() {
    $.ajax({
        url: "ajax/database.php",
        method: "POST",
        datatype: "json",
        data: { 
            action: "update-account",
            value: mapToString()
        }
    })
    .done(function(data, status, xhr) {
        //console.log(data);
        localStorage.setItem("map", touchNo);
        console.log("saved");
    });
}

var clear = function() {
    for (var k = 0; k < items.length; k++) {
        touchNo[k] = 0;
        /*console.log(typeof touchNo);
        console.log(touchNo);
        console.log(k);
        console.log(touchNo[k]);
        console.log(list[touchNo[k]]);*/
        items[k].innerText = list[touchNo[k]];
        if (typeof list[touchNo[k]] != "undefined") {
            items[k].style.fontSize = 
                (slotWidth)+"px";
        }
        else {
            items[k].style.fontSize = 
                (slotWidth/3)+"px";
        }
    }
    saveMap();
}

// Texto para audio
var speaker = true;
var speaking = false;
function say(text) {
    if (!speaking && speaker) {
         speaking = true;
         var msg = new SpeechSynthesisUtterance();
         msg.lang = "pt-BR";
         //msg.lang = "en-US";
         //msg.lang = "ja-JP";
         //msg.lang = "ko-KR";
         //msg.lang = "cmn-CN";
         msg.text = text;
         msg.onend = function(event) {
              speaking = false;
         };
         window.speechSynthesis.speak(msg);
    }
}

$(document).ready(function() {
    motion = true;
    gyroUpdated = function(e) {
        var theta = Math.atan2(e.accY, e.accX);
        // range (-PI, PI]
        if (theta < 0) theta = (2*Math.PI) + theta; // range [0, 360)
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)

        $(".item").css("transform", "rotateZ("+(-theta+90)+"deg)");
    };

    sizeWindow = function() {
    if (!sw) setTimeout(sizeWindow,5000);
    calculateSize(5);
    drawItems();
    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        //msg = "2D3D|"+playerId+"|"+0+"|"+0+"|"+1;
        console.log(msg);
        if (msg[0] == "2D3D" &&
            msg[1] != playerId) {
            console.log("received");
            beepPool.play();
            mapFromString(msg[2]);
        }
        console.log("received");
        saveMap();
    };};
    sizeWindow();
});