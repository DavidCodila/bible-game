precision highp float;

varying vec3 vColor;
varying float vHeightProgress;
uniform vec3 sunDirection;
varying vec3 vWorldPosition;

uniform float uOpacity;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.71, 31.17))) * 43758.5453123);
}

void main(){
    // === LOD DITHERING (DISABLED - Enable when implementing LOD system) ===
    //float threshold = hash(vWorldPosition.xz * 100.0);
    
    //if (threshold > uOpacity) {
    //    discard;
    //}
    // === END LOD ===
    float ao = mix(0.2, 1.0, vHeightProgress);

    float sunExposure = 0.4 + 0.7 * vHeightProgress;
    float directionalLighting = 0.9 + 0.1 * sunDirection.x; 
    
    vec3 finalColor = vColor * sunExposure * directionalLighting * ao * vec3(0.7, 0.8, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
}