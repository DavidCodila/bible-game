import * as THREE from 'three';
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import type { DisposableObject } from '../../types/engine';
import { SUN_DIRECTION } from '../scene/Constants';
import { WORLD_SIZE_METERS  } from '../WorldConfig';
import type { WindService } from '../wind/WindService';
import windEngineChunk from '../../shaders/WindEngine.glsl?raw'; // Import the raw code again

export class GrassShader implements DisposableObject {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };

    constructor(bladeHeight: number, windService: WindService) {
        //const terrainService = TerrainHeightService.getInstance();
        this.uniforms = {
            uTime: windService.uniforms.uTime,
            uWindDirection: windService.uniforms.uWindDirection,
            uWindNoiseTexture: windService.uniforms.uWindNoiseTexture,
            uWindSpeed: windService.uniforms.uWindSpeed,
            uWindFrequency: windService.uniforms.uWindFrequency,
            sunDirection: { value: SUN_DIRECTION.clone() },
            inverseBladeHeight: { value: 1.0 / bladeHeight },
            uOpacity: { value: 1.0 },
            //uHeightMap: { value: terrainService.heightTexture },
            uWorldSize: { value: WORLD_SIZE_METERS },
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                ${windEngineChunk}
                ${vertexShader}
            `,
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

}