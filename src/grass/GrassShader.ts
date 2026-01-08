import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import { LOOP_TIME_IN_RADIANS } from '@src/grass/Constants';
import type { DisposableObject } from '../app/types';

export class GrassShader implements DisposableObject {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };

    constructor(bladeHeight: number, sunDirection: THREE.Vector3) {
        this.uniforms = {
            time: { value: 0 },
            sunDirection: { value: sunDirection.clone().normalize() },
            inverseBladeHeight: { value: 1.0 / bladeHeight }
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

    dispose(): void {
        this.material.dispose();
    }

    public update(elapsedTime: number): void {
        const loopedTime = (elapsedTime % LOOP_TIME_IN_RADIANS);
        this.uniforms.time.value = loopedTime;
    }
}