import * as THREE from 'three';
import { ThreeUtils } from '../tools/ThreeUtils'
import type { SceneController } from './SceneController';

export class TerrainPlane {
    public mesh: THREE.Mesh;

    constructor(sceneController: SceneController) {
        this.mesh = this.createGroundMesh();
        sceneController.add(this.mesh);
    }

    private createGroundMesh(): THREE.Mesh {
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x5c4033,
            roughness: 1.0, 
            metalness: 0.0
        });
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(5000, 5000),
            material
        );
        
        ground.rotation.x = -Math.PI / 2; 
        
        return ground;
    }

    dispose(): void {
        ThreeUtils.disposeMesh(this.mesh);
        console.log("TerrainPlane cleaned up via ThreeUtils.");
    }
}