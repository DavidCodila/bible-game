attribute vec3 instanceOffsets;
attribute float instanceYAxisRotation;
attribute float instanceScaleY;
attribute float instanceBendX;
attribute float instanceBendZ;
attribute vec3 instanceColors;
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

    transformedPosition.y *= instanceScaleY;

    float heightProgress = position.y * inverseBladeHeight;
    vHeightProgress = heightProgress;

    float windEffect = sin(time * 0.8 + instanceOffsets.x * 1.5 + instanceOffsets.z * 1.2) * 0.05;
    float bendBias = pow(heightProgress, 1.6);

    transformedPosition.z += (instanceBendZ + windEffect) * bendBias;
    transformedPosition.x += (instanceBendX) * bendBias;

    vec2 rotatedAroundYAxis = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceYAxisRotation);
    transformedPosition.x = rotatedAroundYAxis.x;
    transformedPosition.z = rotatedAroundYAxis.y;

    vec4 worldPosition = modelMatrix * vec4(transformedPosition + vec3(instanceOffsets.x, 0.0, instanceOffsets.z), 1.0);

    vColor = instanceColors;
    vAmbientOcclusion = instanceAmbientOcclusion;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}