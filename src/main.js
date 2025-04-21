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

// initialize camera location to beginning of maze
camera = new THREE.PerspectiveCamera();
scene.add(camera)
camera.position.x = 200;
camera.position.y = -40;


const directionalLight = new THREE.DirectionalLight( 0xffffff, 5.0 );
scene.add( directionalLight );

// instantiate ambient light
const light = new THREE.AmbientLight( 0x404040, 15.0 ); // soft white light
scene.add( light );

const DayCycle = {
  DAY: 'DAY',
  NIGHT: 'NIGHT'
};

const params = {
  cycle: DayCycle.DAY,
  time: 0.5
};

function makeGUI() {

  gui = new GUI();
  gui.add(params, 'time of day', DayCycle).onChange(initDay);
  gui.add(params, 'time', 0.0, 1).step(0.01).onChange(animate);

}


// create skybox, floor, objects
makeGUI();
skyBox();
makefloor();
initDay();
loadDuck(200, -99, 300);
loadDock(205, -100, 0);
loadBarrel(202, -86, 42);
loadBarrel(202, -86, -42);
loadHouse(0, -53, 0);
loadTree(40, -80, 80);
loadTree(100, -100, -100);

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

function initDay() {
  switch (params.cycle) {
    case params.cycle.DAY:
      console.log("day");
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = 10.0;
      break;
    case params.cycle.NIGHT:
      console.log("night");
      directionalLight.color.setHex(0x805e00);
      directionalLight.intensity = 1.0;
      break;
  }
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
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#06275c", opacity: 0.5, transparent: true}));
// rotate plane to be horizontal
  floor.position.y = - 200;
  floor.rotation.x = Math.PI / 2;
  floor.receiveShadow = true;
  
  const topFloor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: "#5c9aff", opacity: 0.3, transparent: true}));

  topFloor.position.y = - 100;
  topFloor.rotation.x = Math.PI / 2;

  const bFloor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), 
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#276359"}));

  bFloor.position.y = -250;
  bFloor.rotation.x = Math.PI /2;

  const island = new THREE.Mesh(new THREE.SphereGeometry(300, 300, 250), 
  new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: "#155c10"}));

  island.position.y = -350;
  
  scene.add(island);
  scene.add(floor);
  scene.add(topFloor);
  scene.add(bFloor);
}

function CalculateRotation(InitalVec,RotationEuler,MoveSpeed) {
  InitalVec.multiplyScalar(MoveSpeed);
  return InitalVec.applyEuler(RotationEuler);
}

const moveSpeed = 0.5;
const rotationSpeed = 0.05;
var keys = {};
//Camera control code
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

  /* Up & Down
  if (keys['KeyQ']) camera.position.add(CalculateRotation(new THREE.vector3(0,-1,0),camera.rotation,moveSpeed));
  if (keys['KeyE']) camera.position.add(CalculateRotation(new THREE.vector3(0,1,0),camera.rotation,moveSpeed));
  */

  // Rotate Left & Right
  if (keys['ArrowLeft']) camera.rotation.y += rotationSpeed;
  if (keys['ArrowRight']) camera.rotation.y -= rotationSpeed;

  // Rotate Up & Down
  if (keys['ArrowUp']) camera.rotation.x -= rotationSpeed;
  if (keys['ArrowDown']) camera.rotation.x += rotationSpeed;
}

// allows orbit controls and background to work
// renders each frame of the scene and camera's view
function animate() {
	renderer.render( scene, camera );
  updatePosition();
  window.requestAnimationFrame(animate);
}
animate();