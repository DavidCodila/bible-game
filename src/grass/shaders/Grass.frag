varying vec3 vColor;
varying float vHeightProgress;
varying float vAmbientOcclusion;
uniform vec3 sunDirection;

void main(){
    float sunExposure = 0.3 + 0.7 * vHeightProgress; 
    float directionalLighting = 0.9 + 0.1 * sunDirection.x; 
    float baseAmbientOcclusion = mix(0.5, 1.0, pow(vHeightProgress, 0.5)); 
    
    float totalLighting = sunExposure * directionalLighting * baseAmbientOcclusion * vAmbientOcclusion;
    
    vec3 coolSkyTint = vec3(0.7, 0.8, 1);
    
    // DEBUG VIEW: Showing AO only 
    float combinedAO = vAmbientOcclusion * baseAmbientOcclusion;
    vec3 finalColor = vec3(combinedAO); 
    
    // FINAL COLOR: (UNCOMMENT THIS LINE WHEN READY)
    // vec3 finalColor = vColor * totalLighting * coolSkyTint;

    gl_FragColor = vec4(finalColor, 1.0);
}