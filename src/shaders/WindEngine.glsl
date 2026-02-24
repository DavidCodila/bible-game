uniform float uTime;
uniform vec2 uWindDirection;
uniform sampler2D uWindNoiseTexture;
uniform float uWindSpeed;
uniform float uWindFrequency;

// Unified Wind Calculation Logic
float calculateWindForce(vec3 worldPosition, float time, vec2 windDirection, float speed, float frequency, sampler2D noiseTexture) {
    // Scroll the world-space coordinates to simulate a continuous wind front traveling across the field.
    float windTravelDistance = time * speed;
    vec2 windPropagation = worldPosition.xz - (windDirection * windTravelDistance);
    
    // Sample the noise using the moving coordinates
    vec2 windUV = windPropagation * frequency;
    float windNoiseSample = texture2D(noiseTexture, windUV).r;

    // Calculate a rolling sine wave using the same moving coordinates
    // This ensures the wave "crests" are perfectly in sync with the noise patches
    float wavePhase = dot(windPropagation, windDirection) * (frequency * 6.28318);
    float rollingWave = sin(wavePhase);
    
    // Combine for final force (0.0 to 1.0)
    return (rollingWave * 0.5 + 0.5) * windNoiseSample;
}