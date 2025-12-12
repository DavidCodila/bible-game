import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(0, 1.8, 1);
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

const grassPatchSideLength = 10;
const bladesPerRow = 150;
const totalBlades = bladesPerRow * bladesPerRow;
const bladeHeight = 0.4; // Thing about how to redo this

/**
 * Defines the width scaling (taper) along the height of the grass blade.
 * Input: normalizedHeight (0.0 at base, 1.0 at tip)
 * Output: widthFactor (1.0 to 0)
 */
const defaultBladeTaper = (normalizedHeight: number): number => 1.0 - (normalizedHeight * normalizedHeight);

// ---- helper: create a straight blade geometry in local space ----
function createStraightBladeGeometry( bladeWidth: number = 0.05, bladeHeight: number = 0.4, segmentCount: number = 6, taperFunction: (h: number) => number = defaultBladeTaper) {
    const bladeGeometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const triangleIndices: number[] = [];

    loadVertices();
    loadTriangleIndices();

    bladeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    bladeGeometry.setIndex(triangleIndices);
    bladeGeometry.computeVertexNormals();
    return bladeGeometry;

  function loadVertices() {
    for (let segmentIndex = 0; segmentIndex <= segmentCount; segmentIndex++) {
      const normalizedHeight = segmentIndex / segmentCount;
      const yPosition = normalizedHeight * bladeHeight;

      const widthScaleFactor = taperFunction(normalizedHeight);
      const currentWidth = bladeWidth * widthScaleFactor;

      vertices.push(-currentWidth / 2, yPosition, 0);
      vertices.push(currentWidth / 2, yPosition, 0);
    }
  }

  function loadTriangleIndices() {
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
      const lowerSegmentLeftIndex = segmentIndex * 2;
      const lowerSegmentRightIndex = lowerSegmentLeftIndex + 1;
      const upperSegmentLeftIndex = lowerSegmentLeftIndex + 2;
      const upperSegmentRightIndex = lowerSegmentLeftIndex + 3;

      triangleIndices.push(lowerSegmentLeftIndex, lowerSegmentRightIndex, upperSegmentLeftIndex);
      triangleIndices.push(lowerSegmentRightIndex, upperSegmentRightIndex, upperSegmentLeftIndex);
    }
  }
}

// ---- create instanced attributes ----
const bladeGeometry = createStraightBladeGeometry();
const instancedGrassMesh = new THREE.InstancedMesh(bladeGeometry, undefined as any, totalBlades);

// We'll use a ShaderMaterial so we can bend per-vertex in vertex shader
const shaderUniforms = {
  time: { value: 0 },
  sunDirection: { value: new THREE.Vector3(1, 2, 0.5).normalize() },
  inverseBladeHeight: { value: 1.0 / bladeHeight }
};

const vertexShader = `
  attribute vec3 instanceOffset;
  attribute float instanceYAxisRotation;
  attribute float instanceScaleY;
  attribute float instanceZAxisBend;
  attribute float instanceXAxisBend;
  attribute vec3 instanceColor;
  attribute float instanceAmbientOcclusion;
  uniform float time;
  uniform float inverseBladeHeight;
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

    // Calculates 0.0-1.0 normalized height using fast inverse multiplication.
    //    (The scale factors cancel out later, making this mathematically equivalent)
    float heightProgress = position.y * inverseBladeHeight;
    vHeightProgress = heightProgress;

    // Per-instance wind
    float windEffect = sin(time * 0.8 + instanceOffset.x * 1.5 + instanceOffset.z * 1.2) * 0.05;

    // Compute bias to concentrate bending toward tip
    float bendBias = pow(heightProgress, 1.6);

    // Apply bending AFTER scale
    transformedPosition.z += (instanceZAxisBend + windEffect) * bendBias;
    transformedPosition.x += (instanceXAxisBend) * bendBias;

    // Rotate around Y axis
    vec2 rotatedAroundYAxis = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceYAxisRotation);
    transformedPosition.x = rotatedAroundYAxis.x;
    transformedPosition.z = rotatedAroundYAxis.y;

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
    float directionalLighting = 0.9 + 0.1 * sunDirection.x; //need to change to use the dot product
    
    float baseAmbientOcclusion = mix(0.5, 1.0, pow(vHeightProgress, 0.5));
    
    float totalLighting = sunExposure * directionalLighting * baseAmbientOcclusion * vAmbientOcclusion;
    
    vec3 coolSkyTint = vec3(0.7, 0.8, 1);
    
    float combinedAO = vAmbientOcclusion * baseAmbientOcclusion;
    vec3 finalColor = vec3(combinedAO);
    //vec3 finalColor = vColor * totalLighting * coolSkyTint;
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

// allocate arrays for instanced buffer attributes // need to think about changing this

// vector attributes
const VECTOR_3 = 3;
const instanceOffsets = new Float32Array(totalBlades * VECTOR_3);
const instanceColors = new Float32Array(totalBlades * VECTOR_3);

// scalar attributes
const instanceYAxisRotations = new Float32Array(totalBlades);
const instanceYAxisScales = new Float32Array(totalBlades);
const instanceZAxisBend = new Float32Array(totalBlades);
const instanceXAxisBend = new Float32Array(totalBlades);

// fill attributes: use grid with jitter
const gridSpacing = grassPatchSideLength / bladesPerRow;

for (let xIndex = 0; xIndex < bladesPerRow; xIndex++) { 
  for (let zIndex = 0; zIndex < bladesPerRow; zIndex++) {
    const bladeIndex = xIndex * bladesPerRow + zIndex;

    // base grid pos + jitter so distribution looks natural
    const xPosition = xIndex * gridSpacing - grassPatchSideLength / 2 + (Math.random() - 0.5) * gridSpacing * 0.8;
    const zPosition = zIndex * gridSpacing - grassPatchSideLength / 2 + (Math.random() - 0.5) * gridSpacing * 0.8;

    instanceOffsets[bladeIndex * 3 + 0] = xPosition;
    instanceOffsets[bladeIndex * 3 + 1] = 0;
    instanceOffsets[bladeIndex * 3 + 2] = zPosition;

    // random slight rotation
    instanceYAxisRotations[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);;

    // height variation
    instanceYAxisScales[bladeIndex] = 0.7 + Math.random() * 1.2;

    const leanMagnitude = 0.02 + Math.random() * 0.11;
    const leanDirection = (Math.random() - 0.5) * Math.PI / 3;  // ±30° from forward

    // bend forward & side
    instanceZAxisBend[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    instanceXAxisBend[bladeIndex] = leanMagnitude * Math.sin(leanDirection);

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
const instanceAmbientOcclusion = new Float32Array(totalBlades); //upto here
const maximumNeighborDistance = gridSpacing * 2.5;

// Create spatial grid for fast neighbor lookup
const ambientOcclusionGridCellsPerSide = 20;
const ambientOcclusionGridCellSize = grassPatchSideLength / ambientOcclusionGridCellsPerSide;
const ambientOcclusionSpatialGrid: number[][][] = [];

// Initialize grid
for (let xIndex = 0; xIndex < ambientOcclusionGridCellsPerSide; xIndex++) {
  ambientOcclusionSpatialGrid[xIndex] = [];
  for (let zIndex = 0; zIndex < ambientOcclusionGridCellsPerSide; zIndex++) {
    ambientOcclusionSpatialGrid[xIndex][zIndex] = [];
  }
}

// Populate grid with blade indices
for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
  const xPosition = instanceOffsets[bladeIndex * 3 + 0];
  const zPosition = instanceOffsets[bladeIndex * 3 + 2];
  
  const aoGridColumnIndex = Math.floor((xPosition + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
  const aoGridRowIndex = Math.floor((zPosition + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
  
  const validAoGridColumnIndex = Math.max(0, Math.min(ambientOcclusionGridCellsPerSide - 1, aoGridColumnIndex));
  const validAoGridRowIndex = Math.max(0, Math.min(ambientOcclusionGridCellsPerSide - 1, aoGridRowIndex));
  
  ambientOcclusionSpatialGrid[validAoGridColumnIndex][validAoGridRowIndex].push(bladeIndex);
}

// Calculate density for each blade
for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
  const xPosition = instanceOffsets[bladeIndex * 3 + 0];
  const zPosition = instanceOffsets[bladeIndex * 3 + 2];
  
  const aoGridColumnIndex = Math.floor((xPosition + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
  const aoGridRowIndex = Math.floor((zPosition + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
  
  let weightedDensity = 0;
  
  // Check 3x3 grid around current cell
  for (let neighborCellXOffset = -1; neighborCellXOffset <= 1; neighborCellXOffset++) {
    for (let neighborCellZOffset = -1; neighborCellZOffset <= 1; neighborCellZOffset++) {
      const neighborAoGridColumnIndex = aoGridColumnIndex + neighborCellXOffset;
      const nighborAoGridRowIndex = aoGridRowIndex + neighborCellZOffset;
      const indexIsNotWithinGrid = neighborAoGridColumnIndex < 0 
        || neighborAoGridColumnIndex >= ambientOcclusionGridCellsPerSide 
        || nighborAoGridRowIndex < 0 
        || nighborAoGridRowIndex >= ambientOcclusionGridCellsPerSide;
        
      if (indexIsNotWithinGrid) continue;
      
      for (const neighborBladeIndex of ambientOcclusionSpatialGrid[neighborAoGridColumnIndex][nighborAoGridRowIndex]) {
        if (bladeIndex === neighborBladeIndex) continue;
        
        const neighborX = instanceOffsets[neighborBladeIndex * 3 + 0];
        const neighborZ = instanceOffsets[neighborBladeIndex * 3 + 2];
        
        const deltaX = xPosition - neighborX;
        const deltaZ = zPosition - neighborZ;
        const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
        
        
        if (distance < maximumNeighborDistance) {
          // Closer neighbors contribute more
          const distanceWeight = 1.0 - (distance / maximumNeighborDistance);
          weightedDensity += distanceWeight;
        }
      }
    }
  }
  
  // Convert to AO factor
  const maxWeightedDensityForFullDarkening = 20.0;
  const densityFactor = Math.min(weightedDensity / maxWeightedDensityForFullDarkening, 1.0);
  const aoFalloff = Math.sqrt(densityFactor);

  const maximumDarkeningAmount = 0.75;
  instanceAmbientOcclusion[bladeIndex] = 1.0 - (aoFalloff * maximumDarkeningAmount);
}

// Add density AO attribute
bladeGeometry.setAttribute("instanceAmbientOcclusion", new THREE.InstancedBufferAttribute(instanceAmbientOcclusion, 1));
bladeGeometry.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(instanceOffsets, 3));
bladeGeometry.setAttribute("instanceYAxisRotation", new THREE.InstancedBufferAttribute(instanceYAxisRotations, 1));
bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(instanceYAxisScales, 1));
bladeGeometry.setAttribute("instanceZAxisBend", new THREE.InstancedBufferAttribute(instanceZAxisBend, 1));
bladeGeometry.setAttribute("instanceXAxisBend", new THREE.InstancedBufferAttribute(instanceXAxisBend, 1));
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

const ONE_SECOND_IN_MILLISECONDS = 1000, TWO_SECONDS_AT_60FPS = 120;

const twoSecondsHavePassed = () => performance.now() >= stats.lastLogTime + ONE_SECOND_IN_MILLISECONDS * 2;

// For frame metric calculations
const stats = { 
  frameStartTime: 0, frameEndTime: performance.now(), timePerFrame: 0, fps: 0, 
  gpuStartTime: performance.now(), gpuEndTime: performance.now(), gpuTimePerRender: performance.now(),
  lastLogTime: performance.now(), currentTime: performance.now(), oneSecondInMilliseconds: 1000,
  frameTimeHistory: [] as number[], 
  historyCapacity: TWO_SECONDS_AT_60FPS,
  smoothedAvgerageFrameTime: 0, // The smoothed average frame time (ms)
  avgFPS: 0 // The smoothed average FPS
};


function calculateRunningAverage() {
    
    // 1. Get the current end time (the most accurate timestamp available for this frame's completion)
    const newFrameEndTime = performance.now();
    
    // 2. Calculate the raw time difference since the start of the LAST frame
    // stats.frameStartTime holds the *end* time of the previous frame.
    const rawFrameTime = newFrameEndTime - stats.frameStartTime;
    
    // 3. Update the start time for the NEXT frame to be the end time of THIS frame
    stats.frameStartTime = newFrameEndTime; 
    
    // GUARD CLAUSE: Ignore suspicious values (like 0 or massive stutters > 100ms)
    if (rawFrameTime <= 0 || rawFrameTime > 100) {
        return; // Skip this frame time to prevent averaging issues
    }

    // 4. Add the new time to the history array
    stats.frameTimeHistory.push(rawFrameTime);
    
    // 5. Keep the history array size capped
    if (stats.frameTimeHistory.length > stats.historyCapacity) {
        stats.frameTimeHistory.shift(); 
    }
    
    // 6. Calculate the sum of the history
    const totalTime = stats.frameTimeHistory.reduce((sum, time) => sum + time, 0);
    
    // 7. Compute the final smoothed average
    stats.smoothedAvgerageFrameTime = totalTime / stats.frameTimeHistory.length;
    stats.avgFPS = ONE_SECOND_IN_MILLISECONDS / stats.smoothedAvgerageFrameTime;
}

function updateCameraRotation() {
  cameraYaw -= deltaYaw * 0.002;
  cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraPitch - deltaPitch * 0.002));

  camera.rotation.y = cameraYaw;
  camera.rotation.x = cameraPitch;

  deltaYaw = deltaPitch = 0;
}

function logSmoothMetricsPeriodically() {
    if (twoSecondsHavePassed()) {
      console.log(`Avg FPS: ${stats.avgFPS.toFixed(1)} | Avg Frame Time: ${stats.smoothedAvgerageFrameTime.toFixed(2)}ms`); 
      stats.lastLogTime = performance.now();
    }
}

(function renderLoop() {
  requestAnimationFrame(renderLoop);
  calculateRunningAverage(); 
  updateCameraRotation();

  shaderUniforms.time.value += clock.getDelta();
 
  renderer.render(scene, camera);

  logSmoothMetricsPeriodically();
})();