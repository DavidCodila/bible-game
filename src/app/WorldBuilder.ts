import { GameObjectsController } from './GameObjectsController';
import { TerrainPlane } from '../scene/TerrainPlane';
import { brightGrassPatch } from '../grass/Constants';

export const buildWorld = (gameObjectsController: GameObjectsController): void => {
    gameObjectsController.add(new TerrainPlane(), brightGrassPatch());
};