import { GameObjectsController } from '@src/app/GameObjectsController';
import { TerrainPlane } from '@src/scene/TerrainPlane';
import { smallGrassPatch } from '@src/grass/Constants';

export const buildWorld = (gameObjectsController: GameObjectsController): void => {
    gameObjectsController.add(new TerrainPlane());
    createGrassGrid(gameObjectsController);
};

const createGrassGrid = (gameObjectsController: GameObjectsController) : void => {
    const patchSideLength = 1;
    const gridDimension = 10;
    const offsetToCenter = (gridDimension - 1) / 2;

    // 3. Generate the 3x3 grid
    for (let xIndex = 0; xIndex < gridDimension; xIndex++) {
        for (let zIndex = 0; zIndex < gridDimension; zIndex++) {
            const grassPatch = smallGrassPatch();

            // Calculate position centered around world origin (0,0,0)
            const positionX = (xIndex - offsetToCenter) * patchSideLength;
            const positionZ = (zIndex - offsetToCenter) * patchSideLength;

            grassPatch.mesh.position.set(positionX, 0, positionZ);
            
            // Add to controller
            gameObjectsController.add(grassPatch);
        }
    }
}