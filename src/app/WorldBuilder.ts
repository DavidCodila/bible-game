import { GameObjectsController } from '@src/app/GameObjectsController';
import { TerrainPlane } from '@src/scene/TerrainPlane';
import { brightGrassPatch } from '@src/grass/Constants';

export const buildWorld = (gameObjectsController: GameObjectsController): void => {
    gameObjectsController.add(new TerrainPlane());
    gameObjectsController.add(brightGrassPatch());
};