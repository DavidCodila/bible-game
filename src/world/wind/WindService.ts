import * as THREE from 'three';
import windEngineChunk from '../../shaders/WindEngine.glsl?raw';
import { NoiseGenerator } from '../../world/grass/Noise';

(THREE.ShaderChunk as any).WindEngine = windEngineChunk;

export class WindService {
    private readonly gustSizeInMeters = 25.0;

    public readonly uniforms = {
        uTime: { value: 0 },
        uWindDirection: { value: new THREE.Vector2(-1, 0).normalize() },
        uWindSpeed: { value: 8.0 },
        uWindFrequency: { value: 1/this.gustSizeInMeters },
        uWindNoiseTexture: { value: NoiseGenerator.createSeamlessNoise(128) }
    };

    public update(elapsedTime: number): void {
        this.uniforms.uTime.value = elapsedTime;
    }
}