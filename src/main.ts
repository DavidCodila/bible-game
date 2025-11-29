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

const bladeGeometry = createCurvedBlade();

const bladeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,
  side: THREE.DoubleSide,
  depthWrite: true,
  depthTest: true
});

const patchSize = 10;
const bladesPerRow = 35;
const spacing = patchSize / bladesPerRow;

for (let x = 0; x < bladesPerRow; x++) {
  for (let z = 0; z < bladesPerRow; z++) {
    // Clone material for each blade so they can have different colors
    const material = bladeMaterial.clone();
    
    // Vary green shade
    const greenShade = 0.3 + Math.random() * 0.3; // 0.3 to 0.6
    material.color.setRGB(0, greenShade, 0);
    
    const blade = new THREE.Mesh(bladeGeometry, material);
    
    blade.position.x = x * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;
    blade.position.z = z * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;
    
    blade.rotation.y = Math.random() * 0.1 * Math.PI * 2;
    blade.scale.y = 1 + Math.random() * 0.5;
    
    scene.add(blade);
  }
}

// Creates a curved, tapered grass blade geometry
function createCurvedBlade() {
  // Initialize empty geometry container
  const geometry = new THREE.BufferGeometry();
  
  // Blade dimensions
  const width = 0.15;   // Width at base
  const height = 1;     // Total height
  const segments = 3;   // Number of vertical segments (more = smoother curve)
  
  const vertices = [];  // Will hold XYZ coordinates for each vertex
  const indices = [];   // Will define which vertices form triangles
  
  // Create vertices from bottom to top
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;  // Progress from 0 (bottom) to 1 (top)
    const y = t * height;    // Current height position
    
    // Curve forward as it goes up (bends the blade)
    const curve = Math.pow(t, 1.5) * 0.2;
    
    // Taper width toward tip (blade gets thinner at top)
    const currentWidth = width * (1 - t);
    
    // Add left vertex
    vertices.push(-currentWidth / 2, y, curve);
    // Add right vertex
    vertices.push(currentWidth / 2, y, curve);
  }
  
  // Connect vertices into triangles (2 triangles per segment)
  for (let i = 0; i < segments; i++) {
    const base = i * 2;  // Index of current segment's bottom-left vertex
    
    // First triangle (bottom-left, bottom-right, top-left)
    indices.push(base, base + 1, base + 2);
    // Second triangle (bottom-right, top-right, top-left)
    indices.push(base + 1, base + 3, base + 2);
  }
  
  // Assign vertex positions to geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  // Assign triangle indices to geometry
  geometry.setIndex(indices);
  // Calculate normals for lighting (if we add it later)
  geometry.computeVertexNormals();
  
  return geometry;
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