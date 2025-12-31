// @vitest-environment node
import * as THREE from 'three';
import { GrassShader } from '@src/grass/GrassShader';

vi.mock('@src/grass/shaders/Grass.vert?raw', () => ({ default: 'varying vec2 vUv; void main() {}' }));
vi.mock('@src/grass/shaders/Grass.frag?raw', () => ({ default: 'precision mediump float; void main() {}' }));

describe('GrassShader', () => {
    let grassShader: GrassShader;
    const bladeHeight = 2.0;
    const sunDirection = new THREE.Vector3(0, 1, 0);

    beforeEach(() => {
        grassShader = new GrassShader(bladeHeight, sunDirection);
    });

    afterEach(() => {
        grassShader.dispose();
    });

    it('should correctly configure the Three.js ShaderMaterial', () => {
        const material = grassShader.material;
        
        expect(material.vertexShader).toContain('void main()');
        expect(material.fragmentShader).toContain('precision');
        expect(material.side).toBe(THREE.DoubleSide);
    });

    it('should pre-calculate the inverse height for GPU performance', () => {
        const inverseBladeHeight = grassShader.material.uniforms.inverseBladeHeight.value;
        expect(inverseBladeHeight).toBeCloseTo(1/bladeHeight);
    });

    it('should store a normalized copy of the sun direction', () => {
        const inputSunDirection = new THREE.Vector3(10, 0, 0);
        const temporaryShader = new GrassShader(bladeHeight, inputSunDirection);
        const storedSunDirection = temporaryShader.material.uniforms.sunDirection.value;

        verifyNormalizedSunDirection(storedSunDirection);

        const initialX = storedSunDirection.x;
        inputSunDirection.set(0, 0, 1); 
        
        expect(storedSunDirection.x).toBe(initialX);
    });

    it('should update the time uniform without breaking the object reference', () => {
        const timeUniform = grassShader.material.uniforms.time;
        const deltaTime = 0.5;

        grassShader.update(deltaTime);
        
        expect(timeUniform.value).toBe(deltaTime);
        expect(grassShader.material.uniforms.time).toBe(timeUniform);
    });

    it('should properly dispose of WebGL resources', () => {
        const disposeSpy = vi.spyOn(grassShader.material, 'dispose');
        grassShader.dispose();
        expect(disposeSpy).toHaveBeenCalled();
    });
});

function verifyNormalizedSunDirection(storedSunDirection: THREE.Vector3) {
    expect(storedSunDirection.length()).toBeCloseTo(1);
}
