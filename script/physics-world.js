var physicsWorld;

const FLAGS = {
    CF_KINEMATIC_OBJECT: 2
};
const STATE = {
    ACTIVE : 1,
    ISLAND_SLEEPING : 2,
    WANTS_DEACTIVATION : 3,
    DISABLE_DEACTIVATION : 4,
    DISABLE_SIMULATION : 5
};

var rigidBodies = [], 
       tmpTrans;

var ammoTmpPos;
var ammoTmpQuat;

var tmpPos;
var tmpQuat;

var setup = function(Ammo) {
    console.log("setup");
    rigidBodies = [];
    tmpTrans = new Ammo.btTransform();
    ammoTmpPos = new Ammo.btVector3();
    ammoTmpQuat = new Ammo.btQuaternion();
    tmpPos = new THREE.Vector3();
    tmpQuat = new THREE.Quaternion();

    run();
};

var setupPhysicsWorld = function(){

    var collisionConfiguration = 
    new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = 
    new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache =
    new Ammo.btDbvtBroadphase(),
    solver =
    new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld =
    new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

};

var startAmmojs = function() {
    console.log("startAmmojs");
    setupPhysicsWorld();

    //addGround();

    startGyroscopeMonitor();
};

var addGround = function() {
    var pos = ground.position;
    var scale = ground.scale;
    var quat = ground.quaternion;
    var mass = 0;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    body.threeObject = ground;
    physicsWorld.addRigidBody( body );

    ground.userData.tag = "ground";
};

var addBox = function(box, part, compoundShape=false, kinematic=false) {
    var pos = part.position;
    var scale = part.scale;
    var quat = part.quaternion;
    var mass = 1;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    if (kinematic) {
        body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
    }
    body.setActivationState(STATE.DISABLE_DEACTIVATION);

    body.threeObject = box;
    physicsWorld.addRigidBody( body );
    
    box.userData.physicsBody = body;
    box.userData.n =  rigidBodies.length;
    if (compoundShape) {
        compoundShape.addChildShape(transform, box);
    }
    else {
        rigidBodies.push(box);
    }
};

var addCylinder = function(cylinder, part, compoundShape=false, kinematic=false) {
    var pos = part.position;
    var scale = part.scale;
    var quat = part.quaternion;
    var mass = 1;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btCylinderShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    if (kinematic) {
        body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
    }
    body.setActivationState(STATE.DISABLE_DEACTIVATION);

    body.threeObject = cylinder;
    physicsWorld.addRigidBody( body );
    
    cylinder.userData.physicsBody = body;
    cylinder.userData.n =  rigidBodies.length;

    if (compoundShape) {
        compoundShape.addChildShape(transform, cylinder);
    }
    else {
        rigidBodies.push(cylinder);
     }
};

var addSphere = function(sphere, part, compoundShape=false, kinematic=false) {
    var pos = part.position;
    var scale = part.scale;
    var quat = part.quaternion;
    var mass = 1;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btSphereShape( scale.r * 0.5 );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    if (kinematic) {
        body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
    }
    body.setActivationState(STATE.DISABLE_DEACTIVATION);

    body.threeObject = sphere;
    physicsWorld.addRigidBody( body );
    
    sphere.userData.physicsBody = body;
    sphere.userData.n =  rigidBodies.length;

    if (compoundShape) {
        compoundShape.addChildShape(transform, sphere);
    }
    else {
        rigidBodies.push(sphere);
    }
};

var createCompound = function() {
    var compoundShape = new Ammo.btCompoundShape();
    return compoundShape;
}

var connect = function(nBody, qBody) {
    var nPivot = new Ammo.btVector3( 0, 0.125, 0 );
    var qPivot = new Ammo.btVector3( 0, -0.125, 0 );

    var p2p = new Ammo.btPoint2PointConstraint( nBody, qBody, nPivot, qPivot);
    var slid = new Ammo.btSliderConstraint( nBody, qBody, nPivot, qPivot, false);
    var hing = new Ammo.btHingeConstraint( nBody, qBody, nPivot, qPivot, false);
    physicsWorld.addConstraint( p2p, false );
}

var removeBody = function(n) {
    physicsWorld.removeRigidBody(
        rigidBodies.splice(n, 1)
    );
}

var updateAmmojs = function() {
    var deltaTime = clock.getDelta();
    clock.sum += deltaTime;

    // Step world
    physicsWorld.stepSimulation( deltaTime, 10 );

    // Update rigid bodies
    for ( let i = 0; i < rigidBodies.length; i++ ) {
        var objThree = rigidBodies[ i ];
        var objAmmo = objThree.userData.physicsBody;
        var objHelper = objAmmo.helper;
        var ms = objAmmo.getMotionState();
        if (ms) {
            ms.getWorldTransform(tmpTrans);
            var p = tmpTrans.getOrigin();
            var q = tmpTrans.getRotation();
            var offset = objThree.userData.offset;

            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

            // Box for .obj
            if (objHelper) {
                objHelper.position.set(p.x(), p.y(), p.z());
                objHelper.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
    //ws.send("BOOK-ORDER|"+playerId+"|AMMO|"+worldToJSON());
};

var startGyroscopeMonitor = function() {
    motion = true;
    gyroUpdated = function(e) {
        physicsWorld.setGravity(
        new Ammo.btVector3(-e.accX, -e.accY, -e.accZ));
        return;
        var theta = Math.atan2(e.accY, e.accX);
        // range (-PI, PI]
        if (theta < 0) theta = (2*Math.PI) + theta; // range [0, 360)
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)

        $(renderer.domElement)
        .css("transform", "rotateZ("+(-theta+90)+"deg)");
    };
};

var stopGyroscopeMonitor = function() {
    motion = false;
    $(renderer.domElement)
    .css("transform", "initial");
};