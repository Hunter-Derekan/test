import * as THREE from "three";
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Group 4
// COSC3306 Final Project
// Code by Ashlinn and Ethan. referenced links appear where they are implemented from
// the shader turned out a bit underwhelming, but it does fulfill the basic function of moving water
// the directional light unfortunately cant really be placed in front of the sun/moon
// objects, so they will look dark no matter what, even though theyre "emitting" light
// imported objects and textures are referenced in the report
// made objects are denoted where found both here and in the reports
// just be mindful that the initial value of the day and time need to be changed in order 
// to take effect. for some reason, despite setting the initial value to day, it says "undefined"
// but everything will work as intended once a value is set manually

let scene, renderer, camera, gui;

// used to determine shader calculations
let TIME = 0.0;
let windowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera();
scene.add(camera)
// this ensures camera rotation functions like we would expect it to
camera.rotation.order = "YXZ";
camera.position.x = 28;
camera.position.y = -40;
camera.position.z = -12;

// setup light to be used by GUI controller
const directionalLight = new THREE.DirectionalLight( 0xffffff, 5.0 );

// instantiate ambient light
const light = new THREE.AmbientLight( 0x404040, 10.0 ); 
scene.add( light );
// lamps at the house emit lights during night time
const lampLightA = new THREE.PointLight( 0xfff8d6, 30.0, 750 );
lampLightA.position.set( 36, -31, -8 );
lampLightA.power = 350.0;
const lampLightB = new THREE.PointLight( 0xfff8d6, 30.0, 750 );
lampLightB.position.set( 20, -31, -24 );
lampLightB.power = 350.0;

scene.add( lampLightA );
scene.add( lampLightB );

// sun object
const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 32), 
new THREE.MeshLambertMaterial({color: '#fcf1ae'}));
// moon object
const moonTexture = new THREE.TextureLoader().load('textures/moon_surface.png');
const moon = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 32), 
new THREE.MeshLambertMaterial({map: moonTexture}));

// day/night selection
const DayCycle = {
  DAY: 'DAY',
  NIGHT: 'NIGHT'
};
// select day/night, and time of day. for some reason, it refuses to initialize it as day time, so you have to
// manually do it to get everything to appear.
const params = {
  cycle: DayCycle.DAY,
  time: 0
};

// load in all objects, world, gui
makeGUI();
makeWorld();
loadDuck(200, -99, 300);
loadDuck(-150, -99, -200);
loadDuck(-50, -99, -400);
loadDuck(300, -99, 0);
loadDock(205, -100, 0);
loadBarrel(202, -86, 42);
loadBarrel(202, -86, -42);
loadHouse(0, -53, 0);
loadTree(40, -80, 80);
loadTree(100, -110, -100);
loadTree(-100, -90, -70);
loadLamp(36, -26.5, -8);
loadLamp(20, -26.5, -24);

// creates GUI and its functions
function makeGUI() {
  gui = new GUI();
  gui.add(params, 'time of day', DayCycle).onChange(function (value) {
    // during daytime, ambient light and directional light settings are higher
    // to be more bright, and loads in the day sky box/sun
    if (value === DayCycle.DAY) {
      console.log("day");
      light.intensity = 10.0;
      directionalLight.color.setHex(0xded899);
      directionalLight.intensity = 6.0;
      sun.visible = true;
      moon.visible = false;
      lampLightA.visible = false;
      lampLightB.visible = false;
      skyBoxDay();
    }
    // during nighttime, ambient light and directional light settings are lower
    // to be darker, and loads in the night sky box/moon
    if (value === DayCycle.NIGHT) {
      console.log("night");
      light.intensity = 3.0;
      directionalLight.color.setHex(0xcbf7f7);
      directionalLight.intensity = 1.0;
      sun.visible = false;
      moon.visible = true;
      lampLightA.visible = true;
      lampLightB.visible = true;
      skyBoxNight();
    }
    scene.add( directionalLight );
  });

  gui.add(params, 'time', -1, 1).step(0.01).onChange(function (value) {
    // moves light and sun/moon according to time of day. the light and object move together
    // 0 is basically noon/midnight, with values less or greater than 0 being changes
    // in the time from there. the time determines the position of the sun/moon and lights
    if (value < 0) {
      directionalLight.position.x = value * 1000;
      directionalLight.position.y = 1100 + (1100 * value);
      sun.position.x = value * 1000;
      sun.position.y = 1200 + (1200 * value);
      moon.position.x = value * 1000;
      moon.position.y = 1200 + (1200 * value);
    }
    if (value > 0) {
      directionalLight.position.x = value * 1000;
      directionalLight.position.y = 1100 + (1100 * -value);
      sun.position.x = value * 1000;
      sun.position.y = 1200 + (1200 * -value);
      moon.position.x = value * 1000;
      moon.position.y = 1200 + (1200 * -value);
    }
    scene.add(sun);
    scene.add(moon);
  });
}

// loads in duck objects (made by Ethan), placing them at the passed x/y/z coordinates
function loadDuck(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'rubberduck.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(15, 15, 15);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.random(Math.PI / -2);
    scene.add( model );

  } );
}
// loads in the barrel objects, placed at the passed x/y/z coordinates
function loadBarrel(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'Barrel.gltf', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(0.2, 0.2, 0.2);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    scene.add( model );

  } );
}

// loads in the lamp objects (made by Ethan), placed at the passed x/y/z coordinates
function loadLamp(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'lamp2.glb', function ( gltf ) {

    const model = gltf.scene;

    //model.scale.set(10, 10, 10);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    scene.add( model );

  } );
}

// loads in the tree objects, placed at the passed x/y/z coordinates
function loadTree(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'Low_Poly_Tree_GLTF.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(120, 120, 120);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.random(Math.PI / 2);
    scene.add( model );

  } );
}

// loads in the dock object (made by Ethan) at the passed x/y/z coordinates
function loadDock(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'dock.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(50, 50, 50);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.PI;
    scene.add( model );

  } );
}

// loads in the house object at the passed x/y/z coordinates
function loadHouse(x, y, z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'wood_house.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(20, 20, 20);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.PI / 4;
    scene.add( model );

  } );
}

// loads texture files and sets the background to be a cube of daylight sky textures
// taken from user128511 https://stackoverflow.com/questions/59169486/skybox-for-three-js
function skyBoxDay() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'sky/Daylight Box_Right.bmp',
      'sky/Daylight Box_Left.bmp',
      'sky/Daylight Box_Top.bmp',
      'sky/Daylight Box_Bottom.bmp',
      'sky/Daylight Box_Front.bmp',
      'sky/Daylight Box_Back.bmp',
    ]);
    scene.background = texture;
  }
// same as above, for night
// loads texture files and sets the background to be a cube of nighttime sky textures
  function skyBoxNight() {
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
        'sky/skybox_left.png',
        'sky/skybox_right.png',
        'sky/skybox_up.png',
        'sky/skybox_down.png',
        'sky/skybox_front.png',
        'sky/skybox_back.png',
      ]);
      scene.background = texture;
    }

// creates the water and island, and just general scene structure. plane tutorial from
// https://cobweb.cs.uga.edu/~maria/classes/x810-2023-Fall/09-floor-threeJS.html 
function makeWorld() {
// layer under water surface, gives more depth to the water appearance
  const underWater = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#171452", opacity: 0.8, transparent: true}));
  underWater.position.y = - 120;
  underWater.rotation.x = Math.PI / 2;
  underWater.receiveShadow = true;

// bottom of the water
  const bFloor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#2b2510"}));

  bFloor.position.y = -250;
  bFloor.rotation.x = Math.PI /2;
// walls 1-4 are so that you dont look through the water and see the skybox lol
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#173b5c"}));

  wall.position.x = 1000;
  wall.position.y = -200;
  wall.rotation.y = Math.PI / 2;
  scene.add(wall);

  const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#173b5c"}));

  wall2.position.y = -200;
  wall2.position.z = 1000;
  scene.add(wall2);

  const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, color: "#173b5c"}));

  wall3.position.x = -1000;
  wall3.position.y = -200;
  wall3.rotation.y = Math.PI / 2;
  scene.add(wall3);

  const wall4 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, color: "#173b5c"}));

  wall4.position.y = -200;
  wall4.position.z = -1000;
  scene.add(wall4);
  
// island grass
  const grass = new THREE.TextureLoader().load('textures/grass03.png');
  const island = new THREE.Mesh(new THREE.SphereGeometry(300, 300, 250), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, map: grass}));
// island sand
  const sanText = new THREE.TextureLoader().load('textures/sandy_gravel_diff_4k.jpg');
  const sand = new THREE.Mesh(new THREE.SphereGeometry(350, 300, 200), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, map:sanText}));

  sand.position.y = -407;
  island.position.y = -350;

  scene.add(sand);
  scene.add(island);
  scene.add(underWater);
  scene.add(bFloor);
}

// used for camera movement (not rotation) so that it moves in the correct direction
// no matter the camera rotation
function CalculateRotation(InitalVec, RotationEuler, MoveSpeed) {
  InitalVec.multiplyScalar(MoveSpeed);
  return InitalVec.applyEuler(RotationEuler);
}
// values for camera movement
const moveSpeed = 0.5;
var keys = {};
//Camera control code from Ethan
//I know theres things like orbit controls i could've implementated 
//But this seemed real simple and gets the job done
//Listen for when a key is changed and store it's state
document.addEventListener('keydown', (event) => keys[event.code] = true);
document.addEventListener('keyup', (event) => keys[event.code] = false);
//Called every frame
//Will update the camera's position and rotation based on what keys are held down
function updatePosition() {
  // Forward & Backward
  
  if (keys['KeyW']) camera.position.add(CalculateRotation(new THREE.Vector3(0,0,-1),camera.rotation,moveSpeed));
  if (keys['KeyS']) camera.position.add(CalculateRotation(new THREE.Vector3(0,0,1),camera.rotation,moveSpeed));

  // Left & Right
  if (keys['KeyA']) camera.position.add(CalculateRotation(new THREE.Vector3(-1,0,0),camera.rotation,moveSpeed));
  if (keys['KeyD']) camera.position.add(CalculateRotation(new THREE.Vector3(1,0,0),camera.rotation,moveSpeed));

  // taken from https://codesandbox.io/p/sandbox/clever-andras-k3q078?file=%2Fscript.js%3A39%2C1-48%2C3
  // this rotates the camera relatively well. just try to have the mouse in the center of the screen 
  // when entering the tab, or it will be a bit wonky
  document.onmousemove = function (e) {
    camera.rotation.x -= e.movementY / 150;
    camera.rotation.y -= e.movementX / 150;
  };
}

// THIS IS THE ACTUAL WATER SURFACE
// IT IS OUTSIDE THE MAKEWORLD() SO THAT IT ACTUALLY CHANGES THE TIME VALUE IN THE SHADER EVERY FRAME
// shader implementation (see index.html) is derived (partly) from https://codepen.io/fjiumqtd-the-decoder/pen/MWRBOxY 
const water = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
new THREE.ShaderMaterial({side: THREE.BackSide, uniforms: {
  u_time: {value: TIME},
  u_resolution: {value: windowSize}
}, fragmentShader: document.getElementById('fragmentShader').textContent, transparent: true}));

water.position.y = - 100;
water.rotation.x = Math.PI / 2;

scene.add(water);

// renders each frame of the scene and camera's view
function animate() {

  water.material.uniforms.u_time.value += 0.0015;
	renderer.render( scene, camera );
  updatePosition();
  window.requestAnimationFrame(animate);

}

animate();