import * as THREE from 'three';
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import { LOOP_TIME_IN_RADIANS } from './Constants';
import type { DisposableObject } from '../../types/engine';
import { SUN_DIRECTION } from '../scene/Constants';
import { TerrainHeightService } from '../terrain/services/TerrainHeightService';
import { WORLD_SIZE } from '../terrain/Constants';
import { NoiseGenerator } from './Noise';

export class GrassShader implements DisposableObject {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };
    private readonly windDirection = new THREE.Vector2(-1,1).normalize();
    private readonly gustSizeInMeters = 60.0;

    constructor(bladeHeight: number) {
        const terrainService = TerrainHeightService.getInstance();
        const noiseTexture = NoiseGenerator.createSeamlessNoise(128);
        this.uniforms = {
            time: { value: 0 },
            sunDirection: { value: SUN_DIRECTION.clone() },
            inverseBladeHeight: { value: 1.0 / bladeHeight },
            uOpacity: { value: 1.0 },
            uHeightMap: { value: terrainService.heightTexture },
            uWorldSize: { value: WORLD_SIZE },
            uWindDir: {value: this.windDirection},
            uWindNoiseTexture: { value: noiseTexture },
            uWindSpeed: { value: 8 },
            uWindFrequency: { value: 1/this.gustSizeInMeters }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true
        });
    }

    public setOpacity(opacity: number): void {
        this.uniforms.uOpacity.value = opacity;
    }

    dispose(): void {
        this.material.dispose();
    }

    public update(elapsedTime: number): void {
        //const loopedTime = (elapsedTime % LOOP_TIME_IN_RADIANS);
        this.uniforms.time.value = elapsedTime;
        const angleShift = Math.sin(elapsedTime * 0.2) * 0.1;
        this.uniforms.uWindDir.value.set(
        Math.cos(angleShift + 0.5), // Base angle of ~30 degrees
        Math.sin(angleShift + 0.5)
        ).normalize();
    }
}