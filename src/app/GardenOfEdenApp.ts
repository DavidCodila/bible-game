import * as THREE from 'three';
import { StatsTracker } from '../tools/stats/Tracker';
import { InputManager } from './InputManager';
import { GrassPatch } from '../grass/patch/GrassPatch';
import { CameraController } from './CameraController';
import { TerrainPlane } from '../scene/TerrainPlane';
import type { GrassBladeConfig } from '../grass/types';
import { SceneController } from '../scene/SceneController';
import { RendererController } from './RendererController';

export class GardenOfEdenApp {
    private sceneController: SceneController;
    private rendererController : RendererController; 
    private clock: THREE.Clock;
    private statsTracker: StatsTracker;
    private cameraController: CameraController;
    private grassPatch: GrassPatch;
    private terrainPlane: TerrainPlane;

    constructor() {
        this.rendererController = new RendererController(new THREE.WebGLRenderer({alpha: false, antialias: true}));
        this.sceneController = new SceneController(new THREE.Scene());
        this.clock = new THREE.Clock();

        this.statsTracker = new StatsTracker();
        this.cameraController = new CameraController(new THREE.PerspectiveCamera(), new InputManager(this.rendererController.instanceDomElement));
        this.terrainPlane = new TerrainPlane();
        this.sceneController.add(this.terrainPlane.mesh);
        const grassBladeConfig : GrassBladeConfig = {bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 6}
        this.grassPatch = new GrassPatch({sideLength : 10, bladesPerRow: 150, grassBladeConfig: grassBladeConfig});
        this.sceneController.add(this.grassPatch.mesh);

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
        this.grassPatch.update(deltaTime); 

        this.rendererController.render(this.sceneController.sceneInstance, this.cameraController.cameraInstance)
    }
}