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
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshBasicMaterial({ color: 0x3d2817 })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grassPatchSize = 10;
const bladesPerRow = 100;
const totalBlades = bladesPerRow * bladesPerRow;
const bladeHeight = 1.0;
const segmentsPerBlade = 6;

// ---- helper: create a straight blade geometry in local space ----
function createStraightBladeGeometry(width = 0.05, height = bladeHeight, segments = segmentsPerBlade) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let segmentIndex = 0; segmentIndex <= segments; segmentIndex++) {
    const heightProgress = segmentIndex / segments;
    const yPosition = heightProgress * height;
    const currentWidth = width * (1 - heightProgress * heightProgress);
    vertices.push(-currentWidth / 2, yPosition, 0);
    vertices.push(currentWidth / 2, yPosition, 0);
  }
  
  for (let segmentIndex = 0; segmentIndex < segments; segmentIndex++) {
    const baseIndex = segmentIndex * 2;
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
    indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// ---- create instanced attributes ----
const bladeGeometry = createStraightBladeGeometry(0.05, bladeHeight, segmentsPerBlade);
const instancedGrassMesh = new THREE.InstancedMesh(bladeGeometry, undefined as any, totalBlades);

// We'll use a ShaderMaterial so we can bend per-vertex in vertex shader
const shaderUniforms = {
  time: { value: 0 },
  sunDirection: { value: new THREE.Vector3(1, 2, 0.5).normalize() }
};

const vertexShader = `
  attribute vec3 instanceOffset;
  attribute float instanceRotation;
  attribute float instanceScaleY;
  attribute float instanceBendForward;
  attribute float instanceBendSideways;
  attribute vec3 instanceColor;
  attribute float instanceAmbientOcclusion;
  uniform float time;
  varying vec3 vColor;
  varying float vHeightProgress;
  varying float vAmbientOcclusion;

  vec2 rotate2D(in vec2 point, in float angle){
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(cosine * point.x - sine * point.y, sine * point.x + cosine * point.y);
  }

  void main(){
    vec3 transformedPosition = position;

    // Apply vertical scale FIRST
    transformedPosition.y *= instanceScaleY;

    // Recalculate height progress after scaling
    float heightProgress = transformedPosition.y / (${bladeHeight.toFixed(6)} * instanceScaleY);
    vHeightProgress = heightProgress;

    // Per-instance wind
    float windEffect = sin(time * 0.8 + instanceOffset.x * 1.5 + instanceOffset.z * 1.2) * 0.05;

    // Compute bias to concentrate bending toward tip
    float bendBias = pow(heightProgress, 1.6);

    // Apply bending AFTER scale
    transformedPosition.z += (instanceBendForward + windEffect) * bendBias;
    transformedPosition.x += (instanceBendSideways) * bendBias;

    // Rotate around Y axis
    vec2 rotatedXZ = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceRotation);
    transformedPosition.x = rotatedXZ.x;
    transformedPosition.z = rotatedXZ.y;

    // Transform to world space
    vec4 worldPosition = modelMatrix * vec4(transformedPosition + vec3(instanceOffset.x, 0.0, instanceOffset.z), 1.0);

    vColor = instanceColor;
    vAmbientOcclusion = instanceAmbientOcclusion;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vHeightProgress;
  varying float vAmbientOcclusion;
  uniform vec3 sunDirection;

  void main(){
    float sunExposure = 0.3 + 0.7 * vHeightProgress;
    float directionalLighting = 0.9 + 0.1 * sunDirection.x;
    
    float baseAmbientOcclusion = mix(0.5, 1.0, pow(vHeightProgress, 0.5));
    
    float totalLighting = sunExposure * directionalLighting * baseAmbientOcclusion * vAmbientOcclusion;
    
    // Add warm tint (slightly yellow/golden)
    vec3 warmSunlightTint = vec3(0.95, 0.95, 1.0);
    
    vec3 finalColor = vColor * totalLighting * warmSunlightTint;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// create material
const grassMaterial = new THREE.ShaderMaterial({
  uniforms: shaderUniforms,
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  depthWrite: true,
  depthTest: true
});

// attach material after creation
instancedGrassMesh.material = grassMaterial;

// allocate arrays for instanced buffer attributes
const instanceOffsets = new Float32Array(totalBlades * 3);
const instanceRotations = new Float32Array(totalBlades);
const instanceScales = new Float32Array(totalBlades);
const instanceBendForward = new Float32Array(totalBlades);
const instanceBendSideways = new Float32Array(totalBlades);
const instanceColors = new Float32Array(totalBlades * 3);

// fill attributes: use grid with jitter
const gridSpacing = grassPatchSize / bladesPerRow;

for (let xIndex = 0; xIndex < bladesPerRow; xIndex++) {
  for (let zIndex = 0; zIndex < bladesPerRow; zIndex++) {
    const bladeIndex = xIndex * bladesPerRow + zIndex;

    // base grid pos + jitter so distribution looks natural
    const xPosition = xIndex * gridSpacing - grassPatchSize / 2 + (Math.random() - 0.5) * gridSpacing * 0.8;
    const zPosition = zIndex * gridSpacing - grassPatchSize / 2 + (Math.random() - 0.5) * gridSpacing * 0.8;

    instanceOffsets[bladeIndex * 3 + 0] = xPosition;
    instanceOffsets[bladeIndex * 3 + 1] = 0;
    instanceOffsets[bladeIndex * 3 + 2] = zPosition;

    // random slight rotation
    instanceRotations[bladeIndex] = (Math.random() - 0.5) * 0.6;

    // height variation
    instanceScales[bladeIndex] = 0.7 + Math.random() * 1.2;

    // bend forward & side
    instanceBendForward[bladeIndex] = 0.02 + Math.random() * 0.2;
    instanceBendSideways[bladeIndex] = (Math.random() - 0.5) * 0.18;

    // color variation (mix base and tip)
    const greenChannel = 0.25 + Math.random() * 0.35;
    const redChannel = 0.08 + Math.random() * 0.08; 
    const blueChannel = 0.03 + Math.random() * 0.05;
    instanceColors[bladeIndex * 3 + 0] = redChannel;
    instanceColors[bladeIndex * 3 + 1] = greenChannel;
    instanceColors[bladeIndex * 3 + 2] = blueChannel;
  }
}

// ---- Calculate density-based AO using spatial grid (O(n)) ----
const instanceAmbientOcclusion = new Float32Array(totalBlades);
const neighborSearchRadius = gridSpacing * 2.5;

// Create spatial grid for fast neighbor lookup
const aoGridSize = 20;
const aoGridCellSize = grassPatchSize / aoGridSize;
const spatialGrid: number[][][] = [];

// Initialize grid
for (let xIndex = 0; xIndex < aoGridSize; xIndex++) {
  spatialGrid[xIndex] = [];
  for (let zIndex = 0; zIndex < aoGridSize; zIndex++) {
    spatialGrid[xIndex][zIndex] = [];
  }
}

// Populate grid with blade indices
for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
  const xPosition = instanceOffsets[bladeIndex * 3 + 0];
  const zPosition = instanceOffsets[bladeIndex * 3 + 2];
  
  const gridX = Math.floor((xPosition + grassPatchSize / 2) / aoGridCellSize);
  const gridZ = Math.floor((zPosition + grassPatchSize / 2) / aoGridCellSize);
  
  const clampedGridX = Math.max(0, Math.min(aoGridSize - 1, gridX));
  const clampedGridZ = Math.max(0, Math.min(aoGridSize - 1, gridZ));
  
  spatialGrid[clampedGridX][clampedGridZ].push(bladeIndex);
}

// Calculate density for each blade
for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
  const xPosition = instanceOffsets[bladeIndex * 3 + 0];
  const zPosition = instanceOffsets[bladeIndex * 3 + 2];
  
  const gridX = Math.floor((xPosition + grassPatchSize / 2) / aoGridCellSize);
  const gridZ = Math.floor((zPosition + grassPatchSize / 2) / aoGridCellSize);
  
  let neighborCount = 0;
  
  // Check 3x3 grid around current cell
  for (let deltaX = -1; deltaX <= 1; deltaX++) {
    for (let deltaZ = -1; deltaZ <= 1; deltaZ++) {
      const neighborGridX = gridX + deltaX;
      const neighborGridZ = gridZ + deltaZ;
      
      if (neighborGridX < 0 || neighborGridX >= aoGridSize || neighborGridZ < 0 || neighborGridZ >= aoGridSize) continue;
      
      for (const neighborBladeIndex of spatialGrid[neighborGridX][neighborGridZ]) {
        if (bladeIndex === neighborBladeIndex) continue;
        
        const neighborX = instanceOffsets[neighborBladeIndex * 3 + 0];
        const neighborZ = instanceOffsets[neighborBladeIndex * 3 + 2];
        
        const deltaX2 = xPosition - neighborX;
        const deltaZ2 = zPosition - neighborZ;
        const distance = Math.sqrt(deltaX2 * deltaX2 + deltaZ2 * deltaZ2);
        
        if (distance < neighborSearchRadius) {
          neighborCount++;
        }
      }
    }
  }
  
  // Convert to AO factor
  const maxNeighborsForAO = 15;
  const densityFactor = Math.min(neighborCount / maxNeighborsForAO, 1.0);
  instanceAmbientOcclusion[bladeIndex] = 1.0 - (densityFactor * 0.3);
}

// Add density AO attribute
bladeGeometry.setAttribute("instanceAmbientOcclusion", new THREE.InstancedBufferAttribute(instanceAmbientOcclusion, 1));

bladeGeometry.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(instanceOffsets, 3));
bladeGeometry.setAttribute("instanceRotation", new THREE.InstancedBufferAttribute(instanceRotations, 1));
bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(instanceScales, 1));
bladeGeometry.setAttribute("instanceBendForward", new THREE.InstancedBufferAttribute(instanceBendForward, 1));
bladeGeometry.setAttribute("instanceBendSideways", new THREE.InstancedBufferAttribute(instanceBendSideways, 1));
bladeGeometry.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(instanceColors, 3));

instancedGrassMesh.geometry = bladeGeometry;

scene.add(instancedGrassMesh);


// Mouse controls
let cameraYaw = 0;
let cameraPitch = 0;
let deltaYaw = 0;
let deltaPitch = 0;

onmousemove = mouseEvent => {
  if (document.pointerLockElement) {
    deltaYaw += mouseEvent.movementX;
    deltaPitch += mouseEvent.movementY;
  }
};

onclick = () => renderer.domElement.requestPointerLock();
const clock = new THREE.Clock();

// Render loop
(function renderLoop() {
  requestAnimationFrame(renderLoop);
  
  cameraYaw -= deltaYaw * 0.002;
  cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraPitch - deltaPitch * 0.002));
  
  camera.rotation.y = cameraYaw;
  camera.rotation.x = cameraPitch;
  
  deltaYaw = deltaPitch = 0;

  shaderUniforms.time.value += clock.getDelta();
  
  renderer.render(scene, camera);
})();