uniform float uTime;
uniform vec2 uWindDirection;
uniform sampler2D uWindNoiseTexture;
uniform float uWindSpeed;
uniform float uWindFrequency;

// Unified Wind Calculation Logic
float calculateWindForce(vec3 worldPosition, float time, float speed, float frequency, sampler2D noiseTexture) {
    // Scroll the noise field
    vec2 propagation = worldPosition.xz - (uWindDirection * time * speed);
    
    vec2 uv = propagation * frequency;
    float noise = texture2D(noiseTexture, uv).r;

    // Shared phase for both waves
    float phase = dot(propagation, uWindDirection) * (frequency * 6.28318);

    // Squared sine — soft curve, never hits zero
    float gustInital = sin(phase);
    float gust = gustInital * gustInital;

    // Strong minimum floor (eliminates snap to vertical)
    gust = gust * 0.8 + 0.28;

    // Second wave (adds natural variation)
    float finalGust = gust + gustInital * 0.105;

    return finalGust * noise;
}