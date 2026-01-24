import { GameObjectsController } from './GameObjectsController';
import { brightGrassPatch, GRASS_GRID_CONFIG } from '../grass/Constants';

export const buildWorld = (gameObjectsController: GameObjectsController): void => {
    const { patchSize, patchesPerSide } = GRASS_GRID_CONFIG;
    const halfSize = (patchesPerSide * patchSize) / 2;

    for (let x = 0; x < patchesPerSide; x++) {
        for (let z = 0; z < patchesPerSide; z++) {
            const patch = brightGrassPatch();
            const posX = (x * patchSize) - halfSize;
            const posZ = (z * patchSize) - halfSize;

            // IMPORTANT: Set Y to 0. 
            // The Vertex Shader will "lift" the blades onto the hills.
            patch.mesh.position.set(posX, 0, posZ);
            
            gameObjectsController.add(patch);
        }
    }
};