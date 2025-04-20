import * as THREE from "three";
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Group 4
// COSC3306 Final Project

// This project was coded using visual studio code after installing Node.js and was run using the terminal commands
// to install three.js and use 'npx vite' to load up the project 

// most code implementation done by Ashlinn, with camera contrls by Ethan.
// the camera controls aren't perfect, since they don't operate on global position, so rotating 
// makes movement confusing
// we ended up turning the chair into a trap door hatch in the middle of the scene, since the textures for it loaded strangely

// note that the camera position starts out facing the opposite direction of the maze

// https://threejs.org/docs/#manual/en/introduction/Installation 

let scene, renderer, camera;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

// initialize camera location to beginning of maze
camera = new THREE.PerspectiveCamera();
scene.add(camera)
camera.position.x = -275;
camera.position.y = 15;
camera.position.z = -225;

const directionalLight = new THREE.DirectionalLight( 0xffffff, 5.0 );
scene.add( directionalLight );

// instantiate ambient light
const light = new THREE.AmbientLight( 0x404040, 15.0 ); // soft white light
scene.add( light );

const DayCycle = {
  DAY: 'Daytime',
  NIGHT: 'Nighttime'
}

const params = {
  cycle: DayCycle.DAY,
  time: 0.5
}

function makeGUI() {

  const gui = new GUI();
  gui.add(params, 'time of day', DayCycle).onChange(initDay);
  gui.add(params, 'time', 0.0, 1).step(0.01).onChange(animate);

}


// create skybox, floor, and maze walls
makeGUI();
skyBox();
makefloor();
initDay();



function initDay() {
  switch (params.cycle) {
    case DayCycle.DAY:
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = 10.0
      break;
    case DayCycle.NIGHT:
      directionalLight.color.setHex(0x805e00);
      directionalLight.intensity = 1.0
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
  new THREE.MeshLambertMaterial({side: THREE.BackSide, color: "#5c9aff", opacity: 0.3, transparent: true}));

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