import * as THREE from 'three';
import { TerrainHeightService } from '../../world/terrain/services/TerrainHeightService';
import { WORLD_SIZE_METERS } from '../../world/WorldConfig';
import { SIDES, SIDE } from './Sides';

export function perimeterPlacementGenerate() {
    const matrices: THREE.Matrix4[] = [];
    const dummyObject = new THREE.Object3D();
    const halfWorldSize = WORLD_SIZE_METERS / 2;
    const insetAmount = 0.5; 
    const boundaryCoord = halfWorldSize - insetAmount;
    const hedgeWidth = 2.4; 
    const instancesPerSide = Math.ceil((WORLD_SIZE_METERS) / hedgeWidth);

    SIDES.forEach(side => {
        for (let i = 0; i < instancesPerSide; i++) {
            const offset = -halfWorldSize + (i * hedgeWidth);

            let xPosition = 0;
            let zPosition = 0;
            let rotationY = 0;

            switch (side) {
                case SIDE.North:
                    xPosition = offset;
                    zPosition = -boundaryCoord;
                    rotationY = 0; // Facing South (inward)
                    break;
                case SIDE.South:
                    xPosition = offset;
                    zPosition = boundaryCoord;
                    rotationY = Math.PI; // Facing North (inward)
                    break;
                case SIDE.East:
                    xPosition = boundaryCoord;
                    zPosition = offset;
                    rotationY = -Math.PI / 2; // Facing West (inward)
                    break;
                case SIDE.West:
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
    });
    return matrices;
}