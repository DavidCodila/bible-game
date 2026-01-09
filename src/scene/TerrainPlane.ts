import * as THREE from 'three';
import { ThreeUtils } from '../tools/ThreeUtils'
import type { MeshGameObject } from '../app/types';

export class TerrainPlane implements MeshGameObject{
    public mesh: THREE.Mesh;

    constructor() {
        this.mesh = this.createGroundMesh();
    }

    // added for overall code simplicity
    update(_elapsedTime: number): void {}

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