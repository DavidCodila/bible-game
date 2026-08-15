#include <begin_vertex>

// 1. POSITIONING
vec4 worldPosition4 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vec3 worldPos = (modelMatrix * worldPosition4).xyz;

// Per-tree random offset
float treeRandom = fract(sin(dot(worldPos.xz * 0.0137, vec2(12.9898, 78.233))) * 43758.5453);

// 2. WIND SENSING
float windForce = calculateWindForce(
    worldPos, uTime, uWindSpeed, uWindFrequency, uWindNoiseTexture
);

// 3. TRUNK LEAN — heavy & smooth
float heightProgress = clamp(position.y / uTreeHeight, 0.0, 1.0);
float trunkLeanMask = pow(heightProgress, uBendingStiffener);

float targetTrunkLean = windForce * trunkLeanMask * (0.8 + treeRandom * 0.2);
float trunkDamping = 0.09;
float trunkLean = targetTrunkLean;
trunkLean = mix(targetTrunkLean, trunkLean, trunkDamping);

transformed.x += uWindDirection.x * trunkLean * 0.9;
transformed.z += uWindDirection.y * trunkLean * 0.9;

// 4. BRANCH MOVEMENT — now with guaranteed minimum strength
float distFromCenter = length(position.xz);
float branchMask = smoothstep(0.01, 0.45, distFromCenter);

vec2 branchDir = normalize(position.xz + 0.0001);
float alignment = dot(branchDir, uWindDirection);
float sailEffect = 1.0 - abs(alignment);

// Base branch power — increased base so movement is visible even in low wind
float branchPower = windForce * branchMask * -1.0 *sailEffect * 0.2;  // ↑ from 0.18–0.32 range

// Distance factor — tips move more
float distanceFactor = smoothstep(0.0, 0.75, distFromCenter);
branchPower *= (0.8 + distanceFactor * 0.9);  // tips get ~1.7× more

// 5. MILDER BUT VISIBLE FLUTTER
float flutterPhase = uTime * 18.5 + worldPos.x * 1.1 + position.y * 1.4 + treeRandom * 10.0;
float flutter = sin(flutterPhase) * 0.65 + sin(flutterPhase * 3.1) * 0.35;

// Flutter strength — now much milder, scales with distance
float flutterStrength = branchPower * windForce * 0.65 * distanceFactor;  // ↓ from 1.15–1.35

float jitterAmount = flutter * flutterStrength * 0.28;          // ↓ from 0.48
float verticalJitterAmount = cos(flutterPhase * 1.4) * flutterStrength * 0.22;  // ↓ from 0.36

// 6. APPLY FINAL MOTION
float totalBranchDisplacement = branchPower + jitterAmount;

transformed.x -= uWindDirection.x * totalBranchDisplacement;
transformed.z -= uWindDirection.y * totalBranchDisplacement;

// 7. VERTICAL COMPENSATION
transformed.y -= windForce * trunkLeanMask * 0.03;
transformed.y += verticalJitterAmount * 0.9;