import * as THREE from 'three';
import { TerrainHeightService } from '../world/terrain/services/TerrainHeightService';
import { WORLD_SIZE_METERS } from '../world/WorldConfig';

export class MatrixPlacer {
    public static generate(count: number): THREE.Matrix4[] {
        const matrices: THREE.Matrix4[] = [];
        const dummyObject = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * WORLD_SIZE_METERS;
            const z = (Math.random() - 0.5) * WORLD_SIZE_METERS;
            const y = TerrainHeightService.getHeight(x, z);

            dummyObject.position.set(x, y, z);
            dummyObject.rotation.y = Math.random() * Math.PI * 2;
            dummyObject.updateMatrix();
            
            matrices.push(dummyObject.matrix.clone());
        }
        return matrices;
    }
}