import * as THREE from 'three';
import { InputManager } from './InputManager';
import { CameraController } from './camera/CameraController';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';
import { GameObjectsController } from './GameObjectsController';
import { WindowController } from './WindowController';
import { SystemsRegistry } from './SystemsRegistry';
import { initialiseCamera } from './camera/CameraInitialiser';

export function assembleSystemsRegistry(): SystemsRegistry {
    const rendererController = new RendererController(
        new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance", depth: true })
    );
    const sceneController = new SceneController(new THREE.Scene());
    const inputManager = new InputManager(rendererController.instanceDomElement);
    const gameObjectsController = new GameObjectsController(sceneController);
    const camera = initialiseCamera(new THREE.PerspectiveCamera());
    const cameraController = new CameraController(camera, inputManager);

    return new SystemsRegistry({
        rendererController,
        sceneController,
        gameObjectsController,
        inputManager,
        cameraController,
        windowController: new WindowController(rendererController, cameraController)
    });
}