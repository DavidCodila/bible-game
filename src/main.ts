import * as THREE from 'three';

const fieldOfView = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const origin = 0;
const yOffset = 5;
const zOffset = 10;
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio);
camera.position.set(origin, yOffset, zOffset);
camera.rotation.order = 'YXZ';
camera.lookAt(origin, origin, origin);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();



renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

  const skyBlueColour = 0x87ceeb;
  scene.background = new THREE.Color(skyBlueColour); // Sky blue

  const width = 50;
  const depth = 50;
  const greenColour = 0x3a9b3f;
  const groundGeometry = new THREE.PlaneGeometry(width, depth);
  const groundMaterial = new THREE.MeshBasicMaterial({ color: greenColour });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.rotation.x = -Math.PI / 2; //rotate plate about the x axis 90 degrees
  scene.add(ground);

let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;

let deltaYaw = 0;
let deltaPitch = 0;

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === renderer.domElement) {
    deltaYaw += event.movementX;
    deltaPitch += event.movementY;
  }
});

renderer.domElement.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});

function render() {
  requestAnimationFrame(render);
  yaw -= deltaYaw * sensitivity;
  pitch -= deltaPitch * sensitivity;
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
  
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  
  deltaYaw = 0;
  deltaPitch = 0;
  renderer.render(scene, camera);
}

render();