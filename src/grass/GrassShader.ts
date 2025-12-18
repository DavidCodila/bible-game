import * as THREE from 'three';
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';

export class GrassShader {
    public readonly material: THREE.ShaderMaterial;
    private readonly uniforms: { [key: string]: THREE.IUniform };

    constructor(bladeHeight: number) {
        this.uniforms = {
            time: { value: 0 },
            sunDirection: { value: new THREE.Vector3(1, 2, 0.5).normalize() },
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

    public update(deltaTime: number): void {
        this.uniforms.time.value += deltaTime;
    }
}