uniform float uProgress;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    
    vec2 distVec = uv - 0.5;
    distVec.x *= aspect;
    
    float dist = length(distVec);
    
    // SMOOTHING MATH:
    // Using a power of 3 makes the opening feel 'organic' and removes the 'mechanical' look.
    float radius = pow(uProgress, 3.0) * 2.0;
    
    // Antialiased edge: we use fwidth to make the circle edge 
    // pixel-perfect regardless of screen resolution.
    float edge = 0.02; 
    float mask = smoothstep(radius, radius + edge, dist);
    
    gl_FragColor = vec4(vec3(0.0), mask);
}