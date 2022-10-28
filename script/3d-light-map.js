var coinUrl = "https://mapa-php.herokuapp.com/3d/cube-scanner/audio/coin.wav";
var heartUrl = "https://mapa-php.herokuapp.com/game/audio/heart-beat.wav";
// beep-0.mp3

class BeepPool {
    constructor() {
       this.stored = [];
       this.playing = [];
       this.used = 0;
    }
    play() {
       var beep0 = this.stored.length > 0 ? 
       this.stored.pop() : new Audio("/paper/audio/ready-beep.mp3");
       beep0.onended = function() {
           for (var k in this.pool.playing) {
               if (this.timestamp == this.pool.playing[k].timestamp) {
                   this.pool.stored.push(
                       this.pool.playing.splice(k, 1)[0]
                   );
                   this.pool.used += 1;
                   info.innerText = "mp3: "+this.pool.used+
                   (this.pool.playing.length > 0 ?
                   "/"+this.pool.playing.length : "");
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

var sw = window.innerWidth;
var sh = window.innerHeight;
var landscape = sw>sh;

var cameraParams = {
   fov: 75, aspectRatio: 1, near: 0.1, far: 50
};

var lightParams = {
   color: 0xffffff, intensity: 1, distance: 100, decay: 3
};

var $;
var renderer, scene, light, camera, box, eye;

var tmp = { x: 0, y: 0, z: 0 };
var playerId = new Date().getTime();

$(document).ready(function() {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // default THREE.PCFShadowMap
    renderer.setSize(sw-40, sw-40);
    document.body.appendChild( renderer.domElement ); 

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.left = 20+"px";
    renderer.domElement.style.top = 20+"px";
    renderer.domElement.style.border = "1px solid #ccc";
    //renderer.domElement.style.borderRadius = "50%";
    renderer.domElement.style.zIndex = "999";

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    light = new THREE.PointLight(
        lightParams.color,
        lightParams.intensity,
        lightParams.distance,
        lightParams.decay
    );

    light.position.set(2.5, 2, 0);
    light.castShadow = true;
    scene.add(light);
    
    geometry = new THREE.SphereGeometry(1); 
    material = 
    new THREE.MeshBasicMaterial( { 
        color: 0xffffff
    } );
    lightPoint = new THREE.Mesh( geometry, material );
    lightPoint.scale.set(0.1, 0.1, 0.1);
    scene.add( lightPoint );
    lightPoint.position.x = light.position.x;
    lightPoint.position.y = light.position.y;
    lightPoint.position.z = light.position.z;

    camera = new THREE.PerspectiveCamera( 
        cameraParams.fov, 
        cameraParams.aspectRatio, 
        cameraParams.near, 
        cameraParams.far 
    );

    camera.position.set(0, 5, 3.75);
    camera.lookAt(0, 0, 0);

    btnToggleTexture = document.createElement("button");
    btnToggleTexture.style.position = "fixed";
    btnToggleTexture.innerText = "=";
    btnToggleTexture.style.bottom = 215+"px";
    btnToggleTexture.style.left = sw/2-80+"px";
    btnToggleTexture.style.width = "50px";
    btnToggleTexture.style.height = "50px";
    btnToggleTexture.style.border = "1px solid #aaffaa";
    //btnLeft.style.borderRadius = "10%";
    document.body.appendChild(btnToggleTexture);
    $(btnToggleTexture).on("click", function() {
        lightMap.modeNo += 1;
        lightMap.modeNo = lightMap.modeNo > 3 ?
        0 : lightMap.modeNo;
        lightMap.mode = lightMap.modes[lightMap.modeNo];
        renderPlane();
    });

    controlLight = false;
    btnToggleControlLight = document.createElement("button");
    btnToggleControlLight.style.position = "fixed";
    btnToggleControlLight.innerText = "*";
    btnToggleControlLight.style.bottom = 215+"px";
    btnToggleControlLight.style.left = sw/2+30+"px";
    btnToggleControlLight.style.width = "50px";
    btnToggleControlLight.style.height = "50px";
    btnToggleControlLight.style.border = "1px solid #aaffaa";
    //btnLeft.style.borderRadius = "10%";
    document.body.appendChild(btnToggleControlLight);
    $(btnToggleControlLight).on("click", function() {
        controlLight = !controlLight;
    });

    numPixels = 32;
    btnMultiply = document.createElement("button");
    btnMultiply.style.position = "fixed";
    btnMultiply.innerText = "x";
    btnMultiply.style.bottom = 215+"px";
    btnMultiply.style.left = sw/2-140+"px";
    btnMultiply.style.width = "50px";
    btnMultiply.style.height = "50px";
    btnMultiply.style.border = "1px solid #aaffaa";
    document.body.appendChild(btnMultiply);
    $(btnMultiply).on("click", function() {
        numPixels *= 2;
        renderPlane();
    }); 

    btnDivide = document.createElement("button");
    btnDivide.style.position = "fixed";
    btnDivide.innerText = "%";
    btnDivide.style.bottom = 160+"px";
    btnDivide.style.left = sw/2-140+"px";
    btnDivide.style.width = "50px";
    btnDivide.style.height = "50px";
    btnDivide.style.border = "1px solid #aaffaa";
    document.body.appendChild(btnDivide);
    $(btnDivide).on("click", function() {
        numPixels /= 2;
        renderPlane();
    });
    
    btnLeft = document.createElement("button");
    btnLeft.style.position = "fixed";
    btnLeft.innerText = "<";
    btnLeft.style.bottom = 160+"px";
    btnLeft.style.left = sw/2-80+"px";
    btnLeft.style.width = "50px";
    btnLeft.style.height = "50px";
    btnLeft.style.border = "1px solid #aaffaa";
    //btnLeft.style.borderRadius = "10%";
    document.body.appendChild(btnLeft);
    $(btnLeft).on("click", function() {
        if (controlLight) {
            light.position.x -= 0.1;
            lightPoint.position.x -= 0.1;
            renderPlane();
        }
        else {
            scene.rotateY(-(Math.PI/2)/5);
        }
        //ws.send("BOOK-ORDER|"+playerId+"|3D|"+scene.rotation.y);
    });

    btnUp = document.createElement("button");
    btnUp.style.position = "fixed";
    btnUp.innerText = "^";
    btnUp.style.bottom = 215+"px";
    btnUp.style.left = sw/2-25+"px";
    btnUp.style.width = "50px";
    btnUp.style.height = "50px";
    btnUp.style.border = "1px solid #aaffaa";
    //btnUp.style.borderRadius = "10%";
    document.body.appendChild(btnUp);
    $(btnUp).on("click", function() {
        if (controlLight) {
            light.position.z -= 0.1;
            lightPoint.position.z -= 0.1;
            renderPlane();
        }
        else {
            scene.rotateX(-(Math.PI/2)/5);
        }
        //ws.send("BOOK-ORDER|"+playerId+"|3D|"+scene.rotation.y);
    }); 

    btnDown = document.createElement("button");
    btnDown.style.position = "fixed";
    btnDown.innerText = "v";
    btnDown.style.bottom = 160+"px";
    btnDown.style.left = sw/2-25+"px";
    btnDown.style.width = "50px";
    btnDown.style.height = "50px";
    btnDown.style.border = "1px solid #aaffaa";
    //btnDown.style.borderRadius = "10%";
    document.body.appendChild(btnDown);
    $(btnDown).on("click", function() {
        if (controlLight) {
            light.position.z += 0.1;
            lightPoint.position.z += 0.1;
            renderPlane();
        }
        else {
            scene.rotateX((Math.PI/2)/5);
        }
        //ws.send("BOOK-ORDER|"+playerId+"|3D|"+scene.rotation.y);
    });
    $(btnDown).on("dblclick", function() {
        scene.rotation.set(0,0,0);
    });

    btnRight = document.createElement("button");
    btnRight.style.position = "fixed";
    btnRight.innerText = ">";
    btnRight.style.bottom = 160+"px";
    btnRight.style.left = sw/2+30+"px";
    btnRight.style.width = "50px";
    btnRight.style.height = "50px";
    btnRight.style.border = "1px solid #aaffaa";
    //btnRight.style.borderRadius = "10%";
    document.body.appendChild(btnRight);
    $(btnRight).on("click", function() {
        if (controlLight) {
            light.position.x += 0.1;
            lightPoint.position.x += 0.1;
            renderPlane();
        }
        else {
            scene.rotateY((Math.PI/2)/5);
        }
        //ws.send("BOOK-ORDER|"+playerId+"|3D|"+scene.rotation.y);
    });

    info = document.createElement("span");
    info.style.position = "fixed";
    info.style.color = "#ccc";
    info.innerText = "close";
    info.style.left = sw-120+"px";
    info.style.paddingRight = "10px";
    info.style.top = sw-48+"px";
    info.style.width = "100px";
    info.style.height = "18px";
    info.style.textAlign = "right";
    info.style.fontSize = "18px";
    info.style.lineHeight = "18px";
    info.style.zIndex = "1000";
    document.body.appendChild(info);

    Ammo().then(setup);
});

var run = function() {
    //THREE.loadObj("test-21.obj");
    THREE.createPlane2();
    THREE.createPlane4();

    clock = new THREE.Clock();
    clock.sum = 0;
    startAmmojs();
    ammoInterval = setInterval(function() {
        updateAmmojs();
    }, 1000/30);

    render = true;
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.position = "fixed";
    stats.dom.style.left = "21px";
    stats.dom.style.top = "21px";
    document.body.appendChild( stats.dom );

    animate = function() {
        stats.begin();
        if (render) {
            renderer.render( scene, camera );
        }
        stats.end();
        req = requestAnimationFrame( animate );
    };
    animate();

    var zoomControl = $("#zoom")[0];
    $("#zoom").css("transform", "rotateZ(90deg)");
    
    zoomControl.style.display = "block";
    zoomControl.style.position = "fixed";
    zoomControl.style.right = 10+"px";
    zoomControl.style.top = (sh/3)*2+"px";

    $("#zoom").on("change", function() {
        var zoom = parseFloat($("#zoom").val());
        var pos = { x: 0, y: 5, z: 3.75 };
        camera.position.x = pos.x * (1-zoom);
        camera.position.y = pos.y * (1-zoom);
        camera.position.z = pos.z * (1-zoom);
    });
};

var createLightMap = function(url, callback) {
    var canvas = document.createElement("canvas");
    canvas.width = numPixels;
    canvas.height = numPixels;
    var ctx = canvas.getContext("2d");

    canvas.style.position = "fixed";
    canvas.style.right = "0px";
    canvas.style.bottom = "0px";

    canvas.onclick = function() {
       this.remove();
    };

    var img = document.createElement("img");
    img.ctx = ctx;
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        var x = 0;
        var y = 0;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(this, x, y);

        var imgData = 
        this.ctx.getImageData(0, 0, numPixels, numPixels);
        var data = imgData.data;

        var red = 0;
        var green = 0;
        var blue = 0;

        var redFactor = 1;
        var greenFactor = 1;
        var blueFactor = 1;

        //console.log(data);

        newArray = new Array();
        for (var i = 0; i < data.length; i += 4) {
            // red
            red = data[i];
            // green
            green = data[i + 1];
            // blue
            blue = data[i + 2];
            //console.log(red+","+green+","+blue);
            var sum = redFactor + greenFactor + blueFactor;
            //console.log(sum);
            var diff = 
                (red * redFactor) + 
                (green * greenFactor) +
                (blue * blueFactor);
            //console.log(diff);
            diff = (1/255) * (diff/sum);
            //console.log(diff);
            newArray.push(diff);
        }
        set();
    };
    img.src = url;
};

var interval = false;
var set = function() {
    if (interval) clearInterval(interval);
    var i = 0;
    var j = 0;
    interval = setInterval(function() {
        if (j >= numPixels) { j = 0; i++; };
        if (i >= numPixels) { i = 0; clearInterval(interval); return; };
        vertexArray = lightMap.geometry.getAttribute("position").array;
        var random = THREE.MathUtils.randFloat(0, 0.25);

        var pixel = ((i*numPixels)+j);
        //console.log("pixel: "+((i*32)+j));
        //console.log((100/1024)*(((i*32)+j)+1)+"%");

        //console.log(((i*96)+i*3) + (3*j+2));

        vertexArray[((i*(numPixels*3))+i*3) + (3*j+2)] = newArray[pixel];
        vertexArray[((i*(numPixels*3))+i*3) + (3*j+5)] = newArray[pixel];
        vertexArray[(((i+1)*(numPixels*3))+(i+1)*3) + (3*j+2)] = newArray[pixel];
        vertexArray[(((i+1)*(numPixels*3))+(i+1)*3) + (3*j+5)] = newArray[pixel];

        lightMap.geometry.getAttribute("position").needsUpdate = true;
        j++;
    }, 5);
};

var setRandom = function() {
    vertexArray = lightMap.geometry.getAttribute("position").array;
    for (let i = 0; i < (vertexArray.length/3); i++) {
        var random = THREE.MathUtils.randFloat(0, 0.25);
        vertexArray[3 * i + 2] += random;
        //vertexArray[3 * i + 5] += random;
        //vertexArray[3 * i + 8] += random;
    }
    lightMap.geometry.getAttribute("position").needsUpdate = true;
};

var restart = function() {
    if (interval) clearInterval(interval);
    var path = 0;
    vertexArray = lightMap.geometry.getAttribute("position").array;
    for (let i = 0; i < vertexArray.length/3; i++) {
        path += 1/(vertexArray.length/3);
        vertexArray[3 * i + 2] = 0; 
    }
    lightMap.geometry.getAttribute("position").needsUpdate = true;
}

var renderPlane = function() {
    lightMap.geometry = 
    new THREE.PlaneGeometry(5, 5, numPixels, numPixels);
    switch (lightMap.mode) {
        case "blank":
            lightMap.removeTexture();
            lightMap.material.wireframe = true;
            restart();
            break;
        case "textured":
            cropSquare("img/mario.jpeg", function(dataUrl) {
                lightMap.loadTexture(dataUrl);
                lightMap.material.wireframe = false;
                restart();
            });
            break;
        case "wireframe":
            cropSquare("img/mario.jpeg", function(dataUrl) {
                lightMap.loadTexture(dataUrl);
                lightMap.material.wireframe = true;
                createLightMap(dataUrl);
            });
            break;
        case "textured-volume":
            cropSquare("img/mario.jpeg", function(dataUrl) {
                lightMap.loadTexture(dataUrl);
                lightMap.material.wireframe = false;
                createLightMap(dataUrl);
            });
            break;
    }
};

THREE.createPlane2 = function() { //vertices, faces) {
    var vertices = new Array();
    for (var x = 0; x < 8; x++) {
        for (var z = 0; z < 8; z++) {
            var rnd = parseFloat("0." + Math.floor(Math.random()*5.5));
            vertices.push(x*(5/8)-(2.5-(5/16)));
            vertices.push(rnd);
            vertices.push(z*(5/8)-(2.5-(5/16)));
        }
    }
    for (var k = 0; k < vertices.length; k += 3) {
        var pos = {
            x: vertices[k],
            y: vertices[k+1],
            z: vertices[k+2]
        };
        geometry = new THREE.PlaneGeometry(1, 1); 
        material = 
        new THREE.MeshStandardMaterial( { 
            color: 0xaaaaaa, side: THREE.DoubleSide
        } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set(5/8, 5/8, 5/8);
        scene.add( mesh );
        mesh.position.x = pos.x;
        mesh.position.y = pos.y;
        mesh.position.z = pos.z;
        mesh.rotateX(-Math.PI/2);
    }
};

THREE.createPlane4 = function() { //vertices, faces) {
    var planeGeometry = 
    new THREE.PlaneGeometry(5, 5, numPixels, numPixels);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa, wireframe: true
    });
    lightMap = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(lightMap);
    lightMap.texture = false;
    lightMap.modeNo = 0;
    lightMap.modes = 
    ["blank", "textured", "wireframe", "textured-volume"];
    lightMap.position.x = 0;
    lightMap.position.y = 0.9;
    lightMap.position.z = 0;
    lightMap.rotation.x = -Math.PI/2;

    // wireframe
    var geo = new THREE.EdgesGeometry( lightMap.geometry ); 
    // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0x88ff88 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    //lightMap.add( wireframe );
};

THREE.addSphere = function(position) {
    geometry = new THREE.SphereGeometry(1); 
    material = 
    new THREE.MeshStandardMaterial( { 
        color: 0xaaaaaa
    } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set(0.1, 0.1, 0.1);
    scene.add( mesh );
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
}

THREE.loadObj = 
function(objUrl) {
    // instantiate a loader
    var loader = new THREE.OBJLoader();
    // load a resource
    loader.load(
        // resource URL
        "models/"+objUrl,
       // called when resource is loaded
       function ( object ) {
           object.castShadow = true;
           object.receiveShadow = true;
           for (var k in object.children) {
               object.children[k].castShadow = true;
               object.receiveShadow = true;
           }
           scene.add(object);
       },
       // called when loading is in progresses
       function ( xhr ) {
           console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
       },
       // called when loading has errors
       function ( error ) {
           console.log( 'An error happened' );
       }
   );
}

THREE.Object3D.prototype.loadTexture = 
function(url) {
    new THREE.TextureLoader().load(url,
    texture => {
        //Update Texture
        if (this.material) {
            this.material.map = texture;
            this.material.needsUpdate = true;
        }
        else {
            this.children[0].material.map = texture;
            this.children[0].material.needsUpdate = true;
        }
    },
    xhr => {
       //Download Progress
       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    error => {
       //Error CallBack
        console.log("An error happened", error);
    });
};

THREE.Object3D.prototype.removeTexture = 
function() {
    //Update Texture
    if (this.material) {
        this.material.map = null;
        this.material.needsUpdate = true;
    }
    else {
        this.children[0].material.map = null;
        this.children[0].material.needsUpdate = true;
    }
};

/*
3D
- 
- 
2D

*/