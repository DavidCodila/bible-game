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

    vec2 rotatedAroundYAxis = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceYAxisRotation);
    transformedPosition.x = rotatedAroundYAxis.x;
    transformedPosition.z = rotatedAroundYAxis.y;

    float windEffect = sin(time * 0.8 + instanceOffsets.x * 1.5 + instanceOffsets.z * 1.2) * 0.05;
    float bendBias = pow(heightProgress, 1.6);

    transformedPosition.z += (instanceBendZ + windEffect) * bendBias;
    transformedPosition.x += (instanceBendX) * bendBias;

    

    vec4 worldPosition = modelMatrix * vec4(transformedPosition + instanceOffsets, 1.0);
    
    vColor = instanceColors;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}