#include <begin_vertex>

// 1. POSITIONING
vec4 worldPosition4 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vec3 worldPos = (modelMatrix * worldPosition4).xyz;

// 2. WIND SENSING
float windForce = calculateWindForce(
    worldPos, uTime, uWindDirection, uWindSpeed, uWindFrequency, uWindNoiseTexture
);

// 3. TRUNK LEAN (Direction Corrected)
float heightProgress = clamp(position.y / uTreeHeight, 0.0, 1.0);
float trunkLeanMask = pow(heightProgress, uBendingStiffener);

// FLIP: We subtract the wind direction if it was leaning the wrong way.
// If it leans AWAY from the wind now, change '-' to '+'.
transformed.x -= uWindDirection.x * windForce * trunkLeanMask * 1.5;
transformed.z -= uWindDirection.y * windForce * trunkLeanMask * 1.5;

// 4. BRANCH MOVEMENT (The "Paper" Flex)
float distFromCenter = length(position.xz);
// Very sensitive mask to ensure we see movement
float branchMask = smoothstep(0.01, 0.4, distFromCenter);

// Use position to find the branch 'arm'
vec2 branchDir = normalize(position.xz + 0.0001);

// Sail Effect (Perpendicularity)
float alignment = dot(branchDir, uWindDirection);
float sailEffect = 1.0 - abs(alignment);

// Quarter strength as requested
float branchPower = windForce * branchMask * sailEffect * 0.25;

// 5. APPLY BRANCH BEND (No Stretching)
// Instead of re-normalizing, we move the branch along the Wind Direction,
// but we scale it by 'sailEffect' so only the side-branches move.
// This prevents the 'expanding umbrella' look and keeps it as a 'sway'.
transformed.x -= uWindDirection.x * branchPower;
transformed.z -= uWindDirection.y * branchPower;

// 6. VERTICAL COMPENSATION
// Pulling down to simulate the arc of the bend
transformed.y -= (windForce * trunkLeanMask * 0.1) + (branchPower * 0.05);