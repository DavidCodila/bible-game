varying vec3 vColor;
varying float vHeightProgress;
uniform vec3 sunDirection;

void main(){
    float sunExposure = 0.3 + 0.7 * vHeightProgress; 
    float directionalLighting = 0.9 + 0.1 * sunDirection.x; 
    float baseShading = mix(0.5, 1.0, vHeightProgress); 
    
    vec3 finalColor = vColor * sunExposure * directionalLighting * baseShading * vec3(0.7, 0.8, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
}