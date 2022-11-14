var red = "rgba(255, 0, 0, 0.3)";
var cyan = "rgba(0, 255, 255, 0.3)";
var text = "#000";

var sw = window.innerWidth;
var sh = window.innerHeight;
var video;

var objectName;
var startPosX = 0;
var startPosY = 0;
var posX = 0;
var posY = 0;

function rename() {
    objectName.innerHTML = 
    prompt("RENAME:", objectName.innerHTML);
}

function reposition(x, y) {
    video.style.objectPosition = x+"px "+y+"px";
}

function reframe(n = 0) {
    objectName = document.createElement("button");
    objectName.style.position = "fixed";
    objectName.style.border = "2px solid black";
    objectName.style.textAlign = "center";
    objectName.style.backgroundColor = "#FFF";
    objectName.style.color = text;
    objectName.innerHTML = "NECKLACE";
    objectName.style.left = "10px";
    objectName.style.top = "10px";
    objectName.style.width = (sw-20)+"px";
    objectName.style.height = "50px";
    objectName.style.zIndex = "999999";
    objectName.onclick = rename;
    document.body.appendChild(objectName);

    var btnLeft = document.createElement("button");
    btnLeft.style.position = "fixed";
    btnLeft.style.border = "2px solid black";
    btnLeft.style.textAlign = "center";
    btnLeft.style.backgroundColor = "#ccc";
    btnLeft.style.color = text;
    btnLeft.innerHTML = ">";
    btnLeft.style.left = "10px";
    btnLeft.style.bottom = "25px";
    btnLeft.style.width = "50px";
    btnLeft.style.height = "50px";
    btnLeft.style.zIndex = "999999";
    btnLeft.onclick = rotateLeft;
    document.body.appendChild(btnLeft);

    var btnRight = document.createElement("button");
    btnRight.style.position = "fixed";
    btnRight.style.border = "2px solid black";
    btnRight.style.textAlign = "center";
    btnRight.style.backgroundColor = "#ccc";
    btnRight.style.color = text;
    btnRight.innerHTML = "<";
    btnRight.style.right = "10px";
    btnRight.style.bottom = "25px";
    btnRight.style.width = "50px";
    btnRight.style.height = "50px";
    btnRight.style.zIndex = "999999";
    btnRight.onclick = rotateRight;
    document.body.appendChild(btnRight);

    var btnX = document.createElement("button");
    btnX.style.position = "fixed";
    btnX.style.border = "2px solid black";
    btnX.style.textAlign = "center";
    btnX.style.backgroundColor = cyan;
    btnX.style.color = text;
    btnX.innerHTML = "X";
    btnX.style.left = ((sw/4)-25)+"px";
    btnX.style.bottom = "10px";
    btnX.style.width = "50px";
    btnX.style.height = "50px";
    btnX.style.zIndex = "999999";
    btnX.onclick = invertX;
    document.body.appendChild(btnX);
    
    var btnY = document.createElement("button");
    btnY.style.position = "fixed";
    btnY.style.border = "2px solid black";
    btnY.style.textAlign = "center";
    btnY.style.backgroundColor = red;
    btnY.style.color = text;
    btnY.innerHTML = "Y";
    btnY.style.left = (((sw/4)*3)-25)+"px";
    btnY.style.bottom = "10px";
    btnY.style.width = "50px";
    btnY.style.height = "50px";
    btnY.style.zIndex = "999999";
    btnY.onclick = invertY;
    document.body.appendChild(btnY);

    var fit = document.createElement("button");
    fit.style.position = "fixed";
    fit.style.border = "2px solid black";
    fit.style.textAlign = "center";
    fit.style.backgroundColor = "yellow";
    fit.style.color = text;
    fit.innerHTML = "O";
    fit.style.left = ((sw/2)-25)+"px";
    fit.style.bottom = "10px";
    fit.style.width = "50px";
    fit.style.height = "50px";
    fit.style.zIndex = "999999";
    fit.onclick = circle;
    document.body.appendChild(fit);

    var background = document.createElement("div");
    background.style.position = "fixed";
    background.style.backgroundColor = "#FFF";
    background.style.display = "block";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.width = sw+"px";
    background.style.height = sh+"px";
    background.style.zIndex = "9998";
    document.body.appendChild(background);

    video = document.getElementsByTagName("video")[n];
    video.style.position = "fixed";
    video.style.backgroundColor = "#FFF";
    video.style.display = "block";
    video.style.borderRadius = "50%";
    video.style.objectFit = "cover";
    video.style.zIndex = "9999";
    circle();

    var aim = document.createElement("img");
    aim.style.position = "fixed";
    aim.style.display = "block";
    aim.style.left = "0px";
    aim.style.top = "0px";
    aim.style.width = sw+"px";
    aim.style.height = sh+"px";
    aim.style.zIndex = "99999";
    aim.addEventListener("touchstart", function(e) {
         startPosX = e.touches[0].clientX;
         startPosY = e.touches[0].clientY;
    });
    aim.addEventListener("touchmove", function(e) {
         posX += e.touches[0].clientX - startPosX;
         posY += e.touches[0].clientY - startPosY;
         startPosX = e.touches[0].clientX;
         startPosY = e.touches[0].clientY;
         reposition(posX, posY);
    });
    document.body.appendChild(aim);
    drawGuideLines(aim);

    setInterval(function() { 
        //sayTime();
    }, 60000);

    document.body.style.overflow = "hidden";
    document.body.style.display = "initial";
}

function reframe2(n = 0) {
    var background = document.createElement("div");
    background.style.position = "fixed";
    background.style.backgroundColor = "#FFF";
    background.style.display = "block";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.width = sw+"px";
    background.style.height = sh+"px";
    background.style.zIndex = "9998";
    document.body.appendChild(background);

    video = document.getElementsByTagName("video")[n];
    video.style.position = "fixed";
    video.style.backgroundColor = "#000";
    video.style.display = "block";
    //video.style.borderRadius = "50%";
    //video.style.objectFit = "cover";
    video.style.zIndex = "9999";

    var vw = video.videoWidth;
    var vh = video.videoHeight;
    var cr = sw < sh ? (sw/2)-10 : (sh/2)-10;
    var vw2 = Math.floor(vw > vh ? cr*2 : (((1/vh)* vw)*(cr*2)));
    var vh2 = Math.floor(vh > vw ? cr*2 : (((1/vw)* vh)*(cr*2)));

    if (sw < sh) { 
        video.style.left = "10px";
        video.style.top = ((sh/2)-((sw-20)/2))+"px";
    }
    else {
        video.style.left = ((sw/2)-((sh-20)/2))+"px";
        video.style.top = "10px";
    }
    video.style.width = (vw2)+"px";
    video.style.height = (vh2)+"px";
    circle();

    var aim = document.createElement("img");
    aim.style.position = "fixed";
    aim.style.display = "block";
    aim.style.left = "0px";
    aim.style.top = "0px";
    aim.style.width = sw+"px";
    aim.style.height = sh+"px";
    aim.style.zIndex = "99999";
    document.body.appendChild(aim);
    aimColor = "#00C0B4";
    drawGuideLines(aim);

    aim.addEventListener("touchstart", function(e) {
         startPosX = e.touches[0].clientX;
         startPosY = e.touches[0].clientY;
    });
    aim.addEventListener("touchmove", function(e) {
         posX += e.touches[0].clientX - startPosX;
         posY += e.touches[0].clientY - startPosY;
         startPosX = e.touches[0].clientX;
         startPosY = e.touches[0].clientY;
         reposition(posX, posY);
    });

    document.body.style.overflow = "hidden";
    document.body.style.display = "initial";
}

var dark = false;
var aimColor = false;
function drawGuideLines(img) {
     var canvas = document.createElement("canvas");
     canvas.width = sw;
     canvas.height = sh;
     var ctx = canvas.getContext("2d");
    //var ctx = $("#signature").data('jqScribble').brush.context;
    
    ctx.strokeStyle = 
    aimColor ? aimColor :
    (dark ? "#fff" : "#ccc");
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";
    //ctx.fillRect(0, 0, sw, sh);

    ctx.beginPath();
    ctx.moveTo(0, sh/2);
    ctx.lineTo(sw, sh/2);
    ctx.moveTo(sw/2, 0);
    ctx.lineTo(sw/2, sh);
    ctx.closePath();
    ctx.stroke();

    if (sw < sh) { // Mobile computers 
        ctx.beginPath();
        ctx.arc(sw/2, sh/2, (sw/2)-10, 0, 2 * Math.PI, false);
        ctx.stroke();
    }
    else { // Desktop computers
        ctx.beginPath();
        ctx.arc(sw/2, sh/2, (sh/2)-10, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    img.src = canvas.toDataURL();
}

var invertedX = false;
var invertedY = false;

function invertX() {
    invertedX = !invertedX;
    invert();
}

function invertY() {
    invertedY = !invertedY;
    invert();
}

function invert() {
    var xy = "";
    xy += invertedX ? "rotateY(180deg) " :  "";
    xy += invertedY ? "rotateX(180deg) " :  "";
    video.style.transform = xy;
}

var rotation = 0;
function rotateLeft() {
    rotation += 3;
    rotation = rotation <= 360 ? rotation : 0;
    rotate();
}

function rotateRight() {
    rotation -= 3;
    rotation = rotation >= 0 ? rotation : 360;
    rotate();
}

function rotate() {
    video.style.transform = "rotateZ("+rotation+"deg)";
}

function circle() {
    if (sw < sh) {    
        video.style.left = "10px";
        video.style.top = ((sh/2)-((sw-20)/2))+"px";
        video.style.width = (sw-20)+"px";
        video.style.height = (sw-20)+"px";
    }
    else {
        video.style.left = ((sw/2)-((sh-20)/2))+"px";
        video.style.top = "10px";
        video.style.width = (sh-20)+"px";
        video.style.height = (sh-20)+"px";
    }
    video.style.objectPosition = "initial";
}

var even = false;
function threed(ctx) {
   ctx.beginPath();
   ctx.strokeStyle = even ? red : cyan;
   ctx.lineWidth = (sw/2);
   ctx.arc(sw/2, sh/2, ((sw/2)/2)-10, 
   0, 0.5 * Math.PI, false);
   ctx.stroke();

   ctx.beginPath();
   ctx.strokeStyle = even ? cyan : red;
   ctx.lineWidth = (sw/2);
   ctx.arc(sw/2, sh/2, ((sw/2)/2)-10, 
   0.5 * Math.PI, Math.PI, false);
   ctx.stroke();
  
   ctx.beginPath();
   ctx.strokeStyle = even ? red : cyan;
   ctx.lineWidth = (sw/2);
   ctx.arc(sw/2, sh/2, ((sw/2)/2)-10, 
   Math.PI, 1.5 * Math.PI, false);
   ctx.stroke();

   ctx.beginPath();
   ctx.strokeStyle = even ? cyan : red;
   ctx.lineWidth = (sw/2);
   ctx.arc(sw/2, sh/2, ((sw/2)/2)-10, 
   1.5 * Math.PI, 2 * Math.PI, false);
   ctx.stroke();
}
//reframe(0);

/*
var play = document.getElementsByClassName("ytp-large-play")[0];
play.click();

javascript:(function () { var rnd = Math.random(); var script = document.createElement("script");  script.onload = function () { eruda.init(); }; script.src="//cdn.jsdelivr.net/npm/eruda?v="+rnd; document.body.appendChild(script); })();

javascript:(function () { var rnd = Math.random(); var script = document.createElement("script");  script.onload = function () { reframe(); }; script.src="https://phone-phone.herokuapp.com/paper/script/bookmark.js?v="+rnd; document.body.appendChild(script); })();

javascript:(function () { var rnd = Math.random(); var script = document.createElement("script");  script.onload = function () { reframe2(); }; script.src="https://phone-phone.herokuapp.com/paper/script/bookmark.js?v="+rnd; document.body.appendChild(script); })();

javascript:(function () { var rnd = Math.random(); var script = document.createElement("script");  script.onload = function () { alert("abc"); }; script.src="https://phone-phone.herokuapp.com/paper/script/bookmark.js?v="+rnd; document.body.appendChild(script); })();
*/