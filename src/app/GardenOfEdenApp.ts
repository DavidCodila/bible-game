import * as THREE from 'three';
import { StatsTracker } from '../tools/stats/Tracker';
import { InputManager } from './InputManager';
import { CameraController } from './CameraController';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';
import { GameObjectsController } from './GameObjectsController'; 
import { WorldBuilder } from './WorldBuilder';

export class GardenOfEdenApp {
    private sceneController: SceneController;
    private rendererController : RendererController; 
    private clock: THREE.Clock;
    private statsTracker: StatsTracker;
    private cameraController: CameraController;
    private gameObjectsController: GameObjectsController;

    constructor() {
        this.rendererController = new RendererController(new THREE.WebGLRenderer({alpha: false, antialias: true}));
        this.sceneController = new SceneController(new THREE.Scene());
        this.clock = new THREE.Clock();
        this.gameObjectsController = new GameObjectsController(this.sceneController);

        this.statsTracker = new StatsTracker();
        this.cameraController = new CameraController(new THREE.PerspectiveCamera(), new InputManager(this.rendererController.instanceDomElement));
        new WorldBuilder(this.gameObjectsController).buildInitialWorld();

        this.setupWindowListeners();
        this.animate();
    }

    private setupWindowListeners(): void {
        window.addEventListener('resize', () => {
            this.cameraController.resizeWindow();
            this.rendererController.resizeWindow();
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        this.statsTracker.update(); 
        this.cameraController.update(); 
        this.gameObjectsController.update(deltaTime); 

        this.rendererController.render(this.sceneController.sceneInstance, this.cameraController.cameraInstance)
    }
}