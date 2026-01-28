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
uniform float uWindFrequency;

varying vec3 vColor;
varying float vHeightProgress;
varying vec3 vWorldPosition;

vec2 rotate2D(in vec2 point, in float angle){
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(cosine * point.x - sine * point.y, sine * point.x + cosine * point.y);
}

void main(){
    // Initialize local position and apply random height scaling
    vec3 transformedPosition = position;
    transformedPosition.y *= instanceScaleY;

    // Calculate height progress (0 at root, 1 at tip) for bending weight
    float heightProgress = position.y * inverseBladeHeight;
    vHeightProgress = heightProgress;

    // Define the bend bias so the base stays stiff while the tip sways
    float bendingStiffener = 1.8;
    float bendBias = pow(heightProgress, bendingStiffener);

    // Apply unique natural lean to the blade face
    transformedPosition.x += instanceBendX * bendBias;
    transformedPosition.z += instanceBendZ * bendBias;

    // Rotate the blade on its Y-axis for random orientation
    vec2 rotatedPosition = rotate2D(transformedPosition.xz, instanceYAxisRotation);
    transformedPosition.x = rotatedPosition.x;
    transformedPosition.z = rotatedPosition.y;

    // Calculate the absolute world position of the blade's root
    vec3 rootWorldPosition = instanceOffsets + modelMatrix[3].xyz;

    // Scroll the world-space coordinates to simulate a continuous wind front traveling across the field.
    float windTravelDistance = time * uWindSpeed; 
    vec2 windPropagation = rootWorldPosition.xz - (uWindDir * windTravelDistance);

    // Sample the noise using the moving coordinates
    vec2 windUV = windPropagation * uWindFrequency;
    float windNoiseSample = texture2D(uWindNoiseTexture, windUV).r;

    // Calculate a rolling sine wave using the same moving coordinates
    // This ensures the wave "crests" are perfectly in sync with the noise patches
    float wavePhase = dot(windPropagation, uWindDir) * (uWindFrequency * 6.28318);
    float rollingWave = sin(wavePhase);

    // Combine
    float totalWindForce = (rollingWave * 0.5 + 0.5) * windNoiseSample;

    // APPLY GLOBAL WIND DISPLACEMENT
    // Applied after rotation so all grass pushes in the same world direction
    // Weighting Z (0.7) and X (0.3) as requested
    transformedPosition.x += uWindDir.x * totalWindForce * bendBias * 0.3;
    transformedPosition.z += uWindDir.y * totalWindForce * bendBias * 0.7;

    // TERRAIN CONFORMITY
    vec2 terrainUV = (rootWorldPosition.xz + (uWorldSize / 2.0)) / uWorldSize;
    float terrainHeight = texture2D(uHeightMap, terrainUV).r;

    vec3 finalWorldPosition = transformedPosition + rootWorldPosition;
    finalWorldPosition.y += terrainHeight - totalWindForce * 0.08; 
    // used to mitagate streached appearance when bent

    // INTERPOLATED VARYINGS
    vColor = instanceColors;
    vWorldPosition = finalWorldPosition;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalWorldPosition, 1.0);
}