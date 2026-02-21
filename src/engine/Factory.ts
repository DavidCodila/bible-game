import * as THREE from 'three';
import { InputManager } from '../systems/input/InputManager';
import { CameraController } from '../systems/camera/CameraController';
import { SceneController } from '../world/scene/SceneController';
import { RendererController } from '../systems/renderer/RendererController';
import { GameObjectsController } from '../world/logic/GameObjectsController';
import { WindowController } from '../systems/window/WindowController';
import { SystemsRegistry } from './SystemsRegistry';
import { initialiseCamera } from '../systems/camera/CameraInitialiser';
import { LookHandler } from '../systems/camera/LookHandler';
import { MovementHandler } from '../systems/camera/MovementHandler';
import { TerrainPlane } from '../world/terrain/TerrainPlane';
import { AudioController } from '../systems/audio/AudioController';
import { TransitionController } from '../ui/transition/TransitionController';
import { TreeManager } from '../world/trees/TreeManager';
import { CreditsManager } from '../utils/CreditsManager';

export async function assembleSystemsRegistry(): Promise<SystemsRegistry> {
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
    
    await audioController.loadBackgroundMusic('public/audio/EVOE_Generations.mp3');

    const cameraController = new CameraController(camera, new LookHandler(inputManager), new MovementHandler(inputManager));
    const terrainPlane = new TerrainPlane(sceneController);
    const treeManager = new TreeManager(sceneController);
    await treeManager.initialise();
   
    TransitionController.getInstance().initialise(sceneController.sceneInstance);

    CreditsManager.printToConsole();

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