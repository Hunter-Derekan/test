import * as THREE from "three";
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Group 4
// COSC3306 Final Project

let scene, renderer, camera, gui;

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
const light = new THREE.AmbientLight( 0x404040, 15.0 ); // soft white light
scene.add( light );

const moonTexture = new THREE.TextureLoader().load('textures/moon_surface.png');
const sun = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 32), 
new THREE.MeshLambertMaterial({color: '#ffda7d'}));

const moon = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 32), 
new THREE.MeshLambertMaterial({map: moonTexture}));

const DayCycle = {
  DAY: 'DAY',
  NIGHT: 'NIGHT'
};

const params = {
  cycle: DayCycle.DAY,
  time: 0
};

// create skybox, floor, objects
makeGUI();
skyBox();
makefloor();
loadDuck(200, -99, 300);
loadDock(205, -100, 0);
loadBarrel(202, -86, 42);
loadBarrel(202, -86, -42);
loadHouse(0, -53, 0);
loadTree(40, -80, 80);
loadTree(100, -100, -100);
loadLamp(36, -40.2, -8);
loadLamp(20, -40.2, -24);

function makeGUI() {

  gui = new GUI();
  gui.add(params, 'time of day', DayCycle).onChange(function (value) {
    if (value === DayCycle.DAY) {
      console.log("day");
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = 10.0;
      sun.visible = true;
      moon.visible = false;
    }
    if (value === DayCycle.NIGHT) {
      console.log("night");
      directionalLight.color.setHex(0x805e00);
      directionalLight.intensity = 1.0;
      sun.visible = false;
      moon.visible = true;
    }
    scene.add( directionalLight );
  });
  gui.add(params, 'time', -1, 1).step(0.01).onChange(function (value) {

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

function loadDuck(x, y , z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'rubberduck.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(5, 5, 5);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.random(Math.PI / 3);
    scene.add( model );

  } );
}

function loadBarrel(x, y , z) {
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

function loadLamp(x, y , z) {
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

function loadTree(x, y , z) {
  const loader = new GLTFLoader().setPath( 'gltf/' );
  loader.load( 'Low_Poly_Tree_GLTF.glb', function ( gltf ) {

    const model = gltf.scene;

    model.scale.set(120, 120, 120);
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;
    model.rotation.y = Math.random(Math.PI / 3);
    scene.add( model );

  } );
}

function loadDock(x, y , z) {
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

function loadHouse(x, y , z) {
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

// create skybox by loading in textures
// taken from user128511 https://stackoverflow.com/questions/59169486/skybox-for-three-js
function skyBox() {
  // loads texture files and sets the background to be a cube of daylight sky textures
    const loader = new THREE.CubeTextureLoader();

    const texture = loader.load([
      'sky/cloudy_sky-night_01-512x512.png',
      'sky/cloudy_sky-night_02-512x512.png',
      'sky/cloudy_sky-night_01-512x512.png',
      'sky/cloudy_sky-night_02-512x512.png',
      'sky/cloudy_sky-night_01-512x512.png',
      'sky/cloudy_sky-night_02-512x512.png',
    ]);
    scene.background = texture;
  }  

// creates the floor plane. taken from
// https://cobweb.cs.uga.edu/~maria/classes/x810-2023-Fall/09-floor-threeJS.html 
function makefloor() {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#171452", opacity: 0.6, transparent: true}));
  floor.position.y = - 120;
  floor.rotation.x = Math.PI / 2;
  floor.receiveShadow = true;
  
  const topFloor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: "#0072ab", opacity: 0.4, transparent: true}));

  topFloor.position.y = - 100;
  topFloor.rotation.x = Math.PI / 2;

  const bFloor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#2b2510"}));

  bFloor.position.y = -250;
  bFloor.rotation.x = Math.PI /2;

  const wall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#0072ab"}));

  wall.position.x = 1000;
  wall.position.y = -200;
  wall.rotation.y = Math.PI / 2;
  scene.add(wall);

  const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#0072ab"}));

  wall2.position.y = -200;
  wall2.position.z = 1000;
  scene.add(wall2);

  const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, color: "#0072ab"}));

  wall3.position.x = -1000;
  wall3.position.y = -200;
  wall3.rotation.y = Math.PI / 2;
  scene.add(wall3);

  const wall4 = new THREE.Mesh(new THREE.PlaneGeometry(2000, 200), 
  new THREE.MeshLambertMaterial({side: THREE.FrontSide, color: "#0072ab"}));

  wall4.position.y = -200;
  wall4.position.z = -1000;
  scene.add(wall4);

  const island = new THREE.Mesh(new THREE.SphereGeometry(300, 300, 250), 
  new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: "#155c10"}));

  const sand = new THREE.Mesh(new THREE.SphereGeometry(350, 300, 200), 
  new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: "#c2a661"}));

  sand.position.y = -407;
  island.position.y = -350;
  scene.add(sand);
  scene.add(island);
  scene.add(floor);
  scene.add(topFloor);
  scene.add(bFloor);
}

// used for camera movement
function CalculateRotation(InitalVec,RotationEuler,MoveSpeed) {
  InitalVec.multiplyScalar(MoveSpeed);
  return InitalVec.applyEuler(RotationEuler);
}

const moveSpeed = 0.5;
const rotationSpeed = 0.05;
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

  /* Up & Down (this breaks everything for some reason)
  if (keys['KeyQ']) camera.position.add(CalculateRotation(new THREE.vector3(0,-1,0),camera.rotation,moveSpeed));
  if (keys['KeyE']) camera.position.add(CalculateRotation(new THREE.vector3(0,1,0),camera.rotation,moveSpeed));
  */

  // taken from https://codesandbox.io/p/sandbox/clever-andras-k3q078?file=%2Fscript.js%3A39%2C1-48%2C3
  // this rotates the camera relatively well. just try to have the mouse in the center of the screen 
  // when entering the tab, or it will be a bit wonky
  document.onmousemove = function (e) {
    camera.rotation.x -= e.movementY / 150;
    camera.rotation.y -= e.movementX / 150;
  };
}

// allows orbit controls and background to work
// renders each frame of the scene and camera's view
function animate() {
	renderer.render( scene, camera );
  updatePosition();
  window.requestAnimationFrame(animate);
}
animate();