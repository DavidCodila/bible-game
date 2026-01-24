uniform float uProgress;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    
    vec2 distVec = uv - 0.5;
    distVec.x *= aspect;
    
    float dist = length(distVec);
    
    float radius = pow(uProgress, 3.0) * 2.0;
    
    float edge = fwidth(dist) * 3.0; 
    float mask = smoothstep(radius, radius + edge, dist);
    
    gl_FragColor = vec4(vec3(0.0), mask);
}