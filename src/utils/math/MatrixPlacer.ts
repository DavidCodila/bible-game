import * as THREE from 'three';
import { TerrainHeightService } from '../../world/terrain/services/TerrainHeightService';
import { WORLD_SIZE_METERS } from '../../world/WorldConfig';
import { PositionTracker } from './PositionTracker';

export class MatrixPlacer {
    private static instance: MatrixPlacer;
    private positionTracker: PositionTracker;

    private constructor() {
        this.positionTracker = PositionTracker.getInstance();
    }

    public static getInstance() : MatrixPlacer {
        if (!MatrixPlacer.instance) {
            MatrixPlacer.instance = new MatrixPlacer();
        }
        return MatrixPlacer.instance;
    }

    public generateRandomPlacement(count: number): THREE.Matrix4[] {
        const matrices: THREE.Matrix4[] = [];
        const dummyObject = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * (WORLD_SIZE_METERS - 8);
            const z = (Math.random() - 0.5) * (WORLD_SIZE_METERS - 8);

            const y = TerrainHeightService.getHeight(x, z);

            const currentPosition = new THREE.Vector3(x, y, z);

            if (y < 0 || !this.positionTracker.isFree(currentPosition, 20)) {
                i--;
                continue;
            }

            this.positionTracker.register(currentPosition);

            dummyObject.position.copy(currentPosition);
            dummyObject.updateMatrix();
            
            matrices.push(dummyObject.matrix.clone());
        }
        return matrices;
    }   
}