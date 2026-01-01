import { StatsTracker } from '../tools/stats/StatsTracker';
import { InputManager } from './InputManager';
import { CameraController } from './CameraController';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';
import { GameObjectsController } from './GameObjectsController';
import { WindowController } from './WindowController';
import { SystemsRegistry } from './SystemsRegistry';

export function assembleSystemsRegistry(): SystemsRegistry {
    const rendererController = new RendererController(new THREE.WebGLRenderer({ alpha: false, antialias: true }));
    const sceneController = new SceneController(new THREE.Scene());
    const inputManager = new InputManager(rendererController.instanceDomElement);
    const gameObjectsController = new GameObjectsController(sceneController);
    const cameraController = new CameraController(new THREE.PerspectiveCamera(), inputManager);

    return new SystemsRegistry({
        rendererController,
        sceneController,
        gameObjectsController,
        inputManager,
        cameraController,
        statsTracker: new StatsTracker(),
        windowController: new WindowController(rendererController, cameraController)
    });
}