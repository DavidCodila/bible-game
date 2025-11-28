import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(0, 5, 10);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshBasicMaterial({ color: 0x3a9b3f })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Mouse controls
let yaw = 0, pitch = 0;
let deltaYaw = 0, deltaPitch = 0;

onmousemove = e => {
  if (document.pointerLockElement) {
    deltaYaw += e.movementX;
    deltaPitch += e.movementY;
  }
};

onclick = () => renderer.domElement.requestPointerLock();

// Render loop
(function render() {
  requestAnimationFrame(render);
  
  yaw -= deltaYaw * 0.002;
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch - deltaPitch * 0.002));
  
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  
  deltaYaw = deltaPitch = 0;
  
  renderer.render(scene, camera);
})();