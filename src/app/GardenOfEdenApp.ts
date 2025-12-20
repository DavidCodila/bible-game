import * as THREE from 'three';
import { StatsTracker } from '../tools/stats/Tracker';
import { InputManager } from './InputManager';
import { CameraController } from './CameraController';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';
import { GameObjectsController } from './GameObjectsController'; 
import { WorldBuilder } from './WorldBuilder';
import { WindowController } from './WindowController';
import type { DisposableObject } from './types';

export class GardenOfEdenApp implements DisposableObject {
    private sceneController: SceneController;
    private inputManager: InputManager;
    private rendererController : RendererController; 
    private clock: THREE.Clock;
    private statsTracker: StatsTracker;
    private cameraController: CameraController;
    private gameObjectsController: GameObjectsController;
    private windowController: WindowController;
    private disposableObjects: DisposableObject[];
    private animationFrameId: number = 0;
    private isRunning: boolean = true;

    constructor() {
        window.addEventListener('beforeunload', () => this.dispose());
        this.rendererController = new RendererController(new THREE.WebGLRenderer({alpha: false, antialias: true}));
        this.sceneController = new SceneController(new THREE.Scene());
        this.clock = new THREE.Clock();
        this.gameObjectsController = new GameObjectsController(this.sceneController);
        this.statsTracker = new StatsTracker();
        this.inputManager = new InputManager(this.rendererController.instanceDomElement);
        this.cameraController = new CameraController(new THREE.PerspectiveCamera(), this.inputManager);
        this.windowController = new WindowController(this.rendererController, this.cameraController);
        this.disposableObjects = [this.windowController, this.inputManager, this.gameObjectsController, this.sceneController, this.statsTracker, this.rendererController];

        new WorldBuilder(this.gameObjectsController).buildInitialWorld();

        this.animate();
    }

    private animate = () => {
        if (!this.isRunning) return; 
        this.animationFrameId = requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        this.statsTracker.update(); 
        this.cameraController.update(); 
        this.gameObjectsController.update(deltaTime); 
        this.rendererController.render(this.sceneController.sceneInstance, this.cameraController.cameraInstance)
    }

    dispose(): void {
        this.isRunning = false; // Prevent race condition
        cancelAnimationFrame(this.animationFrameId);
        this.disposableObjects.forEach(object => {
            object.dispose();
        });
    }
}