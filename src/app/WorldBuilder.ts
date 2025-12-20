import { GameObjectsController } from './GameObjectsController';
import { TerrainPlane } from '../scene/TerrainPlane';
import { GrassPatch } from '../grass/patch/GrassPatch';
import type { GrassBladeConfig } from '../grass/types';

export class WorldBuilder {
    private gameObjectsController: GameObjectsController;

    constructor(gameObjectsController: GameObjectsController) {
        this.gameObjectsController = gameObjectsController;
    }

    public buildInitialWorld(): void {
        this.createTerrain();
        this.createGrassField();
    }

    public createTerrain() {
        const terrainPlane = new TerrainPlane();
        this.gameObjectsController.add(terrainPlane);
    }

    public createGrassField() {
        const grassBladeConfig : GrassBladeConfig = {
            bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 6
        }
        const grassPatch = new GrassPatch({
            sideLength : 10, bladesPerRow: 150, grassBladeConfig: grassBladeConfig
        });
        this.gameObjectsController.add(grassPatch);
    }
}