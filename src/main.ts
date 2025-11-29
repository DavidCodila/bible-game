import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(0, 5, 10);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: false
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshBasicMaterial({ color: 0x3d2817 })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const bladeGeometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
  -0.15, 0, 0,
  0.15, 0, 0,
  0, 1, 0
]);

bladeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const bladeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,
  side: THREE.DoubleSide,
  depthWrite: true,
  depthTest: true
});

const patchSize = 10; // 1 unit square
const bladesPerRow = 18;
const spacing = patchSize / bladesPerRow;

for (let x = 0; x < bladesPerRow; x++) {
  for (let z = 0; z < bladesPerRow; z++) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    
    // Add random offset to position
    blade.position.x = x * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;
    blade.position.z = z * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;
    
    // Random rotation
    blade.rotation.y = Math.random() * 0.1 * Math.PI * 2;
    
    // Random height variation
    blade.scale.y = 0.7 + Math.random() * 0.6;
    
    scene.add(blade);
  }
}

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