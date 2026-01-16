import * as THREE from 'three';
import { TerrainPlane } from '../scene/TerrainPlane';
import { GrassLODManager } from '../grass/lod/core/GrassLODManager';
import type { GameObjectsController } from './GameObjectsController';

export const buildWorld = (
    gameObjectsController: GameObjectsController,
    camera: THREE.Camera
): void => {
    gameObjectsController.add(new TerrainPlane());
    
    const lodManager = new GrassLODManager(
        gameObjectsController,
        camera
    );
    
    gameObjectsController.add(lodManager);
};

