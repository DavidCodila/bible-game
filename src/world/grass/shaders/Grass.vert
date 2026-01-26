attribute vec3 instanceOffsets;
attribute float instanceYAxisRotation;
attribute float instanceScaleY;
attribute float instanceBendX;
attribute float instanceBendZ;
attribute vec3 instanceColors;
uniform float time;
uniform float inverseBladeHeight;
uniform sampler2D uHeightMap;
uniform sampler2D uWindNoiseTexture;
uniform float uWorldSize;
uniform vec2 uWindDir;
uniform float uWindSpeed;
uniform float uWindScale;

varying vec3 vColor;
varying float vHeightProgress;
varying vec3 vWorldPosition;

vec2 rotate2D(in vec2 point, in float angle){
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(cosine * point.x - sine * point.y, sine * point.x + cosine * point.y);
}

void main(){
    vec3 transformedPosition = position;

    // 1. Vertical Scaling
    transformedPosition.y *= instanceScaleY;

    // 2. Height calculation for bending physics
    float heightProgress = position.y * inverseBladeHeight;
    vHeightProgress = heightProgress;
    float bendBias = pow(heightProgress, 1.6);

    // 3. APPLY LOCAL BEND (Natural Lean)
    // Applied before rotation so the lean is relative to the blade's face
    transformedPosition.x += instanceBendX * bendBias;
    transformedPosition.z += instanceBendZ * bendBias;

    // 4. APPLY Y-AXIS ROTATION
    // Orient the blade in the world
    vec2 rotatedPosition = rotate2D(transformedPosition.xz, instanceYAxisRotation);
    transformedPosition.x = rotatedPosition.x;
    transformedPosition.z = rotatedPosition.y;

    // 5. UNIFIED WIND PROPAGATION
    vec3 rootWorldPosition = instanceOffsets + modelMatrix[3].xyz;

    // We calculate a "Moving Coordinate System". 
    // This shifts the world coordinates in the direction of the wind over time.
    float windTravelDistance = time * uWindSpeed * 20.0; 
    vec2 movingCoordinates = rootWorldPosition.xz - (uWindDir * windTravelDistance);

    // Sample the noise using the moving coordinates
    vec2 windUV = movingCoordinates * uWindScale;
    float windNoiseSample = texture2D(uWindNoiseTexture, windUV).r;

    // Calculate a rolling sine wave using the same moving coordinates
    // This ensures the wave "crests" are perfectly in sync with the noise patches
    float wavePhase = (movingCoordinates.x + movingCoordinates.y) * 0.2;
    float rollingWave = sin(wavePhase);

    // Combine noise and sine wave for the final force
    float totalWindForce = (rollingWave * 0.3 + 0.7) * windNoiseSample;

    // 6. APPLY GLOBAL WIND DISPLACEMENT
    // Applied after rotation so all grass pushes in the same world direction
    // Weighting Z (0.7) and X (0.3) as requested
    transformedPosition.x += uWindDir.x * totalWindForce * bendBias * 0.3;
    transformedPosition.z += uWindDir.y * totalWindForce * bendBias * 0.7;

    // 7. TERRAIN CONFORMITY
    vec2 terrainUV = (rootWorldPosition.xz + (uWorldSize / 2.0)) / uWorldSize;
    float terrainHeight = texture2D(uHeightMap, terrainUV).r;

    vec3 finalWorldPosition = transformedPosition + rootWorldPosition;
    finalWorldPosition.y += terrainHeight;

    // 8. INTERPOLATED VARYINGS
    vColor = instanceColors;
    vWorldPosition = finalWorldPosition;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalWorldPosition, 1.0);
}