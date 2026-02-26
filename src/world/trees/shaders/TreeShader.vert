#include <begin_vertex>

// 1. POSITIONING
vec4 worldPosition4 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vec3 worldPos = (modelMatrix * worldPosition4).xyz;

// 2. WIND SENSING
float windForce = calculateWindForce(
    worldPos, uTime, uWindDirection, uWindSpeed, uWindFrequency, uWindNoiseTexture
);

// 3. TRUNK LEAN
float heightProgress = clamp(position.y / uTreeHeight, 0.0, 1.0);
float trunkLeanMask = pow(heightProgress, uBendingStiffener);

transformed.x -= uWindDirection.x * windForce * trunkLeanMask * 1.5;
transformed.z -= uWindDirection.y * windForce * trunkLeanMask * 1.5;

// 4. BRANCH MOVEMENT (The "Paper" Flex)
float distFromCenter = length(position.xz);
float branchMask = smoothstep(0.01, 0.4, distFromCenter);

vec2 branchDir = normalize(position.xz + 0.0001);
float alignment = dot(branchDir, uWindDirection);
float sailEffect = 1.0 - abs(alignment);

// Base power
float branchPower = windForce * branchMask * sailEffect * 0.25;

// 5. SUBTLE JITTER (3D Flutter)
// Horizontal Jitter (X/Z)
float jitterWave = sin(uTime * 10.0 + worldPos.x + position.y);
float jitterAmount = jitterWave * branchPower * 0.25;

// Vertical Jitter (Y) - We use 'cos' and a slightly different frequency 
// so the leaf 'circles' or 'flutters' rather than just sliding diagonally.
float verticalJitterWave = cos(uTime * 12.0 + worldPos.z + position.x);
float verticalJitterAmount = verticalJitterWave * branchPower * 0.2; 

// 6. APPLY FINAL MOTION
float totalBranchDisplacement = branchPower + jitterAmount;

transformed.x -= uWindDirection.x * totalBranchDisplacement;
transformed.z -= uWindDirection.y * totalBranchDisplacement;

// 7. VERTICAL COMPENSATION + JITTER
// We combine the natural 'dip' of the branch with the new vertical flutter
transformed.y -= (windForce * trunkLeanMask * 0.1) + (totalBranchDisplacement * 0.05);
transformed.y += verticalJitterAmount;