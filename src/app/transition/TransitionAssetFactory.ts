import * as THREE from 'three';
import verttrexShader from './shaders/TransitionController.vert?raw';
import fragmentShader from './shaders/TransitionController.frag?raw';

export class TransitionAssetFactory {
    public static createMaterial(): THREE.ShaderMaterial {
        return new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uProgress: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: verttrexShader,
            fragmentShader: fragmentShader
        });
    }

    public static createMesh(material: THREE.ShaderMaterial): THREE.Mesh {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        mesh.renderOrder = 9999;
        mesh.frustumCulled = false;
        return mesh;
    }
}