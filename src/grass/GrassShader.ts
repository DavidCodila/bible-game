import * as THREE from 'three';
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import { LOOP_TIME_IN_RADIANS } from './Constants';
import type { DisposableObject } from '../app/types';
import { SUN_DIRECTION } from '../scene/Constants';

export class GrassShader implements DisposableObject {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };

    constructor(bladeHeight: number) {
        this.uniforms = {
            time: { value: 0 },
            sunDirection: { value: SUN_DIRECTION.clone() },
            inverseBladeHeight: { value: 1.0 / bladeHeight },
            uPatchScale: { value: 1.0 }
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

    public setDissolve(scale: number): void {
        this.uniforms.uPatchScale.value = scale;
    }

    dispose(): void {
        this.material.dispose();
    }

    public update(elapsedTime: number): void {
        const loopedTime = (elapsedTime % LOOP_TIME_IN_RADIANS);
        this.uniforms.time.value = loopedTime;
    }
}