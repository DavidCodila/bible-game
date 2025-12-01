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

const patchSize = 10;
const bladesPerRow = 80;
const totalBlades = bladesPerRow * bladesPerRow;
const bladeHeight = 1.0;
const segmentsPerBlade = 6; // Need to change

// ---- helper: create a straight blade geometry in local space ----
function createStraightBladeGeometry(width = 0.05, height = bladeHeight, segments = segmentsPerBlade) {
  const geom = new THREE.BufferGeometry();
  const verts: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * height;
    // start as straight; shader will bend
    const w = width * (1 - t * t); // gentle taper in model space
    verts.push(-w / 2, y, 0); // left
    verts.push( w / 2, y, 0); // right
  }
  for (let i = 0; i < segments; i++) {
    const base = i * 2;
    indices.push(base, base + 1, base + 2);
    indices.push(base + 1, base + 3, base + 2);
  }

  geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

// ---- create instanced attributes ----
const bladeGeom = createStraightBladeGeometry(0.05, bladeHeight, segmentsPerBlade);
const instanced = new THREE.InstancedMesh(bladeGeom, undefined as any, totalBlades);

// We'll use a ShaderMaterial so we can bend per-vertex in vertex shader
const uniforms = {
  time: { value: 0 }
};

const vertexShader = `
  attribute vec3 instanceOffset;
  attribute float instanceRot;
  attribute float instanceScaleY;
  attribute float instanceBendF;
  attribute float instanceBendS;
  attribute vec3 instanceColor;
  uniform float time;
  varying vec3 vColor;
  varying float vHeightT;

  vec2 rot2(in vec2 p, in float a){
    float s = sin(a), c = cos(a);
    return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
  }

  void main(){
    vec3 pos = position;

    // Apply vertical scale FIRST
    pos.y *= instanceScaleY;

    // Recalculate t after scaling
    float t = pos.y / (${bladeHeight.toFixed(6)} * instanceScaleY);
    vHeightT = t;

    // Per-instance wind
    float wind = sin(time * 0.8 + instanceOffset.x * 1.5 + instanceOffset.z * 1.2) * 0.02;

    // Compute bias
    float bias = pow(t, 1.6);

    // Apply bending AFTER scale
    pos.z += (instanceBendF + wind) * bias;
    pos.x += (instanceBendS) * bias;

    // Rotate around Y
    vec2 xr = rot2(vec2(pos.x, pos.z), instanceRot);
    pos.x = xr.x;
    pos.z = xr.y;

    // Transform to world
    vec4 worldPos = modelMatrix * vec4(pos + vec3(instanceOffset.x, 0.0, instanceOffset.z), 1.0);

    vColor = instanceColor;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vHeightT;
  
  void main(){
    // Height-based gradient only
    float brightness = mix(0.5, 1.0, vHeightT);
    vec3 col = vColor * brightness;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// create material
const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  depthWrite: true,
  depthTest: true
  // enable instancing - implicit when attached to InstancedMesh
});

// attach material after creation
instanced.material = mat;

// allocate arrays for instanced buffer attributes
const offsets = new Float32Array(totalBlades * 3); // x,z stored at x,z; y unused
const rots = new Float32Array(totalBlades);
const scales = new Float32Array(totalBlades);
const bendF = new Float32Array(totalBlades);
const bendS = new Float32Array(totalBlades);
const colors = new Float32Array(totalBlades * 3);

// fill attributes: use grid with jitter
let i = 0;

const spacing = patchSize / bladesPerRow;

for (let x = 0; x < bladesPerRow; x++) {
  for (let z = 0; z < bladesPerRow; z++) {
    const idx = x * bladesPerRow + z;

    // base grid pos + jitter so distribution looks natural
    const px = x * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;
    const pz = z * spacing - patchSize / 2 + (Math.random() - 0.5) * spacing * 0.8;

    offsets[ idx*3 + 0 ] = px;
    offsets[ idx*3 + 1 ] = 0;
    offsets[ idx*3 + 2 ] = pz;

    // random slight rotation
    rots[idx] = (Math.random() - 0.5) * 0.6;

    // height variation
    scales[idx] = 0.7 + Math.random() * 1.2;

    // bend forward & side
    bendF[idx] = 0.02 + Math.random() * 0.2;       // forward
    bendS[idx] = (Math.random() - 0.5) * 0.18;     // left/right

    // color variation (mix base and tip)
    const g = 0.35 + Math.random() * 0.4; // wider range
    const r = 0.05 + Math.random() * 0.1;
    const b = 0.05 + Math.random() * 0.1;
    colors[ idx*3 + 0 ] = r;
    colors[ idx*3 + 1 ] = g;
    colors[ idx*3 + 2 ] = b;

    i++;
  }
}

bladeGeom.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(offsets, 3));
bladeGeom.setAttribute("instanceRot", new THREE.InstancedBufferAttribute(rots, 1));
bladeGeom.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(scales, 1));
bladeGeom.setAttribute("instanceBendF", new THREE.InstancedBufferAttribute(bendF, 1));
bladeGeom.setAttribute("instanceBendS", new THREE.InstancedBufferAttribute(bendS, 1));
bladeGeom.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(colors, 3));

instanced.geometry = bladeGeom;

scene.add(instanced);


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
const clock = new THREE.Clock();

// Render loop
(function render() {
  requestAnimationFrame(render);
  
  yaw -= deltaYaw * 0.002;
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch - deltaPitch * 0.002));
  
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  
  deltaYaw = deltaPitch = 0;

  uniforms.time.value += clock.getDelta();
  
  renderer.render(scene, camera);
})();