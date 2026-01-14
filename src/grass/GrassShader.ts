import * as THREE from 'three';
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import { LOOP_TIME_IN_RADIANS } from './Constants';
import type { DisposableObject } from '../app/types';

export class GrassShader implements DisposableObject {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };

    constructor(bladeHeight: number, sunDirection: THREE.Vector3) {
        this.uniforms = {
            time: { value: 0 },
            sunDirection: { value: sunDirection.clone().normalize() },
            inverseBladeHeight: { value: 1.0 / bladeHeight },
            uPatchScale: { value: 1.0 },
            //uWindDirection: { value: new THREE.Vector2(1.0, 0.2).normalize() },
            //uWindStrength: { value: 0.25 }, // Slightly higher since we are mostly leaning forward
            //uWindSpeed: { value: 0.8 }
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