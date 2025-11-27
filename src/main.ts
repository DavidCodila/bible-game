import * as THREE from 'three';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function renderSky() {
  const skyBlueColour = 0x87ceeb;
  scene.background = new THREE.Color(skyBlueColour); // Sky blue
}

function renderGround() {
  const width = 50;
  const depth = 50;
  const greenColour = 0x3a9b3f;
  const groundGeometry = new THREE.PlaneGeometry(width, depth);
  const groundMaterial = new THREE.MeshBasicMaterial({ color: greenColour });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.rotation.x = -Math.PI / 2; //rotate plate about the x axis 90 degrees
  scene.add(ground);
}

function createCamera() : THREE.PerspectiveCamera {
  const fieldOfView = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const nearClip = 0.1;
  const farClip = 1000;

  const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearClip, farClip);

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  return camera;
}

function render() {
  renderSky();
  renderGround();
  requestAnimationFrame(render);
  renderer.render(scene, createCamera());
}

render();