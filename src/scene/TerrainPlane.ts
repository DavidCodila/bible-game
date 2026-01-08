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
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0x3d2817 }) // need to alter here and in tests later...
        );
        // Correct rotation to lie flat on the XZ plane
        ground.rotation.x = -Math.PI / 2; 
        
        return ground;
    }

    dispose(): void {
        ThreeUtils.disposeMesh(this.mesh);
        console.log("TerrainPlane cleaned up via ThreeUtils.");
    }
}