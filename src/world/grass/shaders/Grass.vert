attribute vec3 instanceOffsets;
attribute float instanceYAxisRotation;
attribute float instanceScaleY;
attribute float instanceBendX;
attribute float instanceBendZ;
attribute vec3 instanceColors;
uniform float time;
uniform float inverseBladeHeight;
varying vec3 vColor;
varying float vHeightProgress;
varying vec3 vWorldPosition;
uniform sampler2D uHeightMap;
uniform float uWorldSize;

vec2 rotate2D(in vec2 point, in float angle){
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(cosine * point.x - sine * point.y, sine * point.x + cosine * point.y);
}

void main(){
    vec3 transformedPosition = position;

    transformedPosition.y *= instanceScaleY;

    float heightProgress = position.y * inverseBladeHeight;
    vHeightProgress = heightProgress;

    vec3 rootWorldPos = instanceOffsets + modelMatrix[3].xyz;
    vec2 terrainUV = (rootWorldPos.xz + (uWorldSize / 2.0)) / uWorldSize;
    float terrainHeight = texture2D(uHeightMap, terrainUV).r;

    float windEffect = sin(time * 0.8 + instanceOffsets.x * 1.5 + instanceOffsets.z * 1.2) * 0.1;
    float bendBias = pow(heightProgress, 1.6);

    transformedPosition.z += (instanceBendZ + windEffect) * bendBias;
    transformedPosition.x += (instanceBendX) * bendBias;

    vec2 rotatedAroundYAxis = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceYAxisRotation);
    transformedPosition.x = rotatedAroundYAxis.x;
    transformedPosition.z = rotatedAroundYAxis.y;

    vec3 worldSpacePos = transformedPosition + rootWorldPos;
    worldSpacePos.y += terrainHeight; // Add the fixed height

    // Sample the height from the shared DataTexture

    //worldSpacePos.y += terrainHeight;
    
    vColor = instanceColors;

    vWorldPosition = worldSpacePos;

    gl_Position = projectionMatrix * viewMatrix * vec4(worldSpacePos, 1.0);
}