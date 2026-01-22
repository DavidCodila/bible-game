import * as THREE from 'three';
import { InputManager } from './InputManager';
import { CameraController } from './camera/CameraController';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';
import { GameObjectsController } from './GameObjectsController';
import { WindowController } from './WindowController';
import { SystemsRegistry } from './SystemsRegistry';
import { initialiseCamera } from './camera/CameraInitialiser';
import { LookHandler } from './camera/LookHandler';
import { MovementHandler } from './camera/MovementHandler';
import { TerrainPlane } from '../terrain/TerrainPlane';
import { AudioController } from './camera/AudioController';

export function assembleSystemsRegistry(): SystemsRegistry {
    const rendererController = new RendererController(
        new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance", depth: true })
    );
    const sceneController = new SceneController(new THREE.Scene());
    const inputManager = new InputManager(rendererController.instanceDomElement);
    const gameObjectsController = new GameObjectsController(sceneController);
    const camera = new THREE.PerspectiveCamera();
    const audioListener = new THREE.AudioListener();
    initialiseCamera(camera, audioListener);
    const audioController = new AudioController(audioListener);
    audioController.loadBackgroundMusic('src/assets/audio/EVOE_Generations.mp3');
    const cameraController = new CameraController(camera, new LookHandler(inputManager), new MovementHandler(inputManager));
    const terrainPlane = new TerrainPlane(sceneController);

    return new SystemsRegistry({
        rendererController,
        sceneController,
        gameObjectsController,
        inputManager,
        cameraController,
        audioController,
        windowController: new WindowController(rendererController, cameraController),
        terrainPlane
    });
}