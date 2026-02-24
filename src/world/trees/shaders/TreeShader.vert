#include <begin_vertex>

vec4 worldPosition4 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vec3 worldPos = (modelMatrix * worldPosition4).xyz;

float windForce = calculateWindForce(
    worldPos, 
    uTime, 
    uWindDirection, 
    uWindSpeed, 
    uWindFrequency, 
    uWindNoiseTexture
);

float heightProgress = clamp(position.y / uTreeHeight, 0.0, 1.0);
float bendBias = pow(heightProgress, uBendingStiffener);

transformed.x += uWindDirection.x * windForce * bendBias;
transformed.z += uWindDirection.y * windForce * bendBias;
transformed.y -= windForce * bendBias * 0.08;