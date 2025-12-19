import * as THREE from 'three';
import type { GameObject } from '../app/types';

/**
 * Creates and manages the static terrain plane geometry for the scene.
 */
export class TerrainPlane implements GameObject{
    public mesh: THREE.Mesh;

    constructor() {
        this.mesh = this.createGroundMesh();
    }

    // added for overall code simplicity
    update(deltaTime: number): void {}

    private createGroundMesh(): THREE.Mesh {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0x3d2817 })
        );
        // Correct rotation to lie flat on the XZ plane
        ground.rotation.x = -Math.PI / 2; 
        
        return ground;
    }
}