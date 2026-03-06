import * as THREE from 'three';
import { TerrainHeightService } from '../../world/terrain/services/TerrainHeightService';
import { WORLD_SIZE_METERS } from '../../world/WorldConfig';

export class MatrixPlacer {
    private placedPositions : THREE.Vector3[];
    private static instance: MatrixPlacer;

    private constructor() {
        this.placedPositions = [];
    }

    public static getInstance() : MatrixPlacer {
        if (!MatrixPlacer.instance) {
            MatrixPlacer.instance = new MatrixPlacer();
        }
        return MatrixPlacer.instance;
    }
    public generate(count: number): THREE.Matrix4[] {
        const matrices: THREE.Matrix4[] = [];
        const dummyObject = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            let hasError = false;
            const x = (Math.random() - 0.5) * (WORLD_SIZE_METERS - 8);
            const z = (Math.random() - 0.5) * (WORLD_SIZE_METERS - 8);
            const y = TerrainHeightService.getHeight(x, z);

            if (y < -1) {
                hasError = true;
            }

            const currentPosition = new THREE.Vector3(x, y, z);

            // Distance check
            if (!hasError) {
                for (const otherPosition of this.placedPositions) {
                    if (currentPosition.distanceToSquared(otherPosition) < 20) {
                        hasError = true;
                        break;
                    }
                }
            }

            if (hasError) {
                i--;
                continue;
            }

            this.placedPositions.push(currentPosition);

            dummyObject.position.copy(currentPosition);
            dummyObject.updateMatrix();
            
            matrices.push(dummyObject.matrix.clone());
        }
        return matrices;
    }

    public static perimeterPlacementGenerate() {
        const matrices: THREE.Matrix4[] = [];
        const dummyObject = new THREE.Object3D();

        const halfWorldSize = WORLD_SIZE_METERS / 2;
        // Inset the hedge by half its depth so it doesn't hang off the map edge
        const insetAmount = 0.5; 
        const boundaryCoord = halfWorldSize - insetAmount;

        // Adjust hedgeWidth based on your actual model's horizontal span
        const hedgeWidth = 2.4; 
        // Calculate instances based on the inset boundary, not the total world size
        const instancesPerSide = Math.ceil((WORLD_SIZE_METERS) / hedgeWidth);

        for (let sideIndex = 0; sideIndex < 4; sideIndex++) {
            for (let i = 0; i < instancesPerSide; i++) {
                // Calculate progress from one corner to the next
                const offset = -halfWorldSize + (i * hedgeWidth);

                let xPosition = 0;
                let zPosition = 0;
                let rotationY = 0;

                switch (sideIndex) {
                    case 0: // North Wall
                        xPosition = offset;
                        zPosition = -boundaryCoord;
                        rotationY = 0; // Facing South (inward)
                        break;
                    case 1: // South Wall
                        xPosition = offset;
                        zPosition = boundaryCoord;
                        rotationY = Math.PI; // Facing North (inward)
                        break;
                    case 2: // East Wall
                        xPosition = boundaryCoord;
                        zPosition = offset;
                        rotationY = -Math.PI / 2; // Facing West (inward)
                        break;
                    case 3: // West Wall
                        xPosition = -boundaryCoord;
                        zPosition = offset;
                        rotationY = Math.PI / 2; // Facing East (inward)
                        break;
                }

                const yPosition = TerrainHeightService.getHeight(xPosition, zPosition);

                dummyObject.position.set(xPosition, yPosition, zPosition);
                dummyObject.rotation.y = rotationY;
                
                dummyObject.updateMatrix();
                matrices.push(dummyObject.matrix.clone());
            }
        }
        return matrices;
    }
}