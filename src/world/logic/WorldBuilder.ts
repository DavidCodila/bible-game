import { GameObjectsController } from './GameObjectsController';
import { brightGrassPatch, GRASS_GRID_CONFIG } from '../grass/Constants';
import type { WindService } from '../wind/WindService';
import { HALF_WORLD_SIZE_METERS } from '../WorldConfig';

export const buildWorld = (gameObjectsController: GameObjectsController, windService: WindService): void => {
    gameObjectsController.add(brightGrassPatch(windService));
    /*
    const { patchSize, patchesPerSide } = GRASS_GRID_CONFIG;
    const halfSize = (patchesPerSide * patchSize) / 2;

    for (let x = 0; x < patchesPerSide; x++) {
        for (let z = 0; z < patchesPerSide; z++) {
            const patch = brightGrassPatch(windService);
            const posX = (x * patchSize) - halfSize;
            const posZ = (z * patchSize) - halfSize;

            // IMPORTANT: Set Y to 0. 
            // The Vertex Shader will "lift" the blades onto the hills.
            patch.mesh.position.set(posX, 0, posZ);
            
            gameObjectsController.add(patch);
        }
    }
    */
};