import { GameObjectsController } from './GameObjectsController';
import { TerrainPlane } from '../scene/TerrainPlane';
import { brightGrassPatch, GRASS_GRID_CONFIG } from '../grass/Constants';

export const buildWorld = (gameObjectsController: GameObjectsController): void => {
    gameObjectsController.add(new TerrainPlane(), brightGrassPatch());
    const { patchSize, patchesPerSide, spacingMultiplier } = GRASS_GRID_CONFIG;
    
    // Calculate the starting offset to keep the entire grid centered
    const halfpatchesPerSide = (patchesPerSide * patchSize) * spacingMultiplier;
    const centerOffset = patchSize * spacingMultiplier;

    for (let x = 0; x < patchesPerSide; x++) {
        for (let z = 0; z < patchesPerSide; z++) {
            const patch = brightGrassPatch();
            
            // Calculate position: (Index * Size) - HalfTotalWidth + CenterAdjustment
            const posX = (x * patchSize) - halfpatchesPerSide + centerOffset;
            const posZ = (z * patchSize) - halfpatchesPerSide + centerOffset;

            patch.mesh.position.set(posX, 0, posZ);
            
            // Ensure Frustum Culling is enabled for each individual patch
            patch.mesh.frustumCulled = true; 
            
            gameObjectsController.add(patch);
        }
    }
};