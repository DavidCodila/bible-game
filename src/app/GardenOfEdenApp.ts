import * as THREE from 'three';
import { StatsTracker } from '../tools/stats/Tracker';
import { InputManager } from './InputManager';
import { GrassPatch } from '../grass/patch/GrassPatch';
import { CameraController } from './CameraController';
import { TerrainPlane } from '../scene/TerrainPlane';
import type { GrassBladeConfig } from '../grass/types';

/**
 * The core application manager for the Garden of Eden environment.
 * Responsible for scene setup, core state, and the render loop orchestration.
 */
export class GardenOfEdenApp {
    private scene: THREE.Scene;
    
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private statsTracker: StatsTracker;
    private cameraController: CameraController;
    private grassPatch: GrassPatch;
    private terrainPlane: TerrainPlane;

    constructor() {
        this.renderer = this.setupRenderer();
        this.scene = this.setupScene();
        this.clock = new THREE.Clock();

        this.statsTracker = new StatsTracker();
        this.cameraController = new CameraController(new THREE.PerspectiveCamera(), new InputManager(this.renderer.domElement));
        this.terrainPlane = new TerrainPlane();
        this.scene.add(this.terrainPlane.mesh);
        const grassBladeConfig : GrassBladeConfig = {bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 6}
        this.grassPatch = new GrassPatch({sideLength : 10, bladesPerRow: 150, grassBladeConfig: grassBladeConfig});
        this.scene.add(this.grassPatch.mesh);

        this.setupWindowListeners();
        this.animate();
    }

    private setupScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        return scene;
    }

    private setupRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    private setupWindowListeners(): void {
        window.addEventListener('resize', () => {
            this.cameraController.resizeWindow();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        this.statsTracker.update(); 
        this.cameraController.update(); 
        this.grassPatch.update(deltaTime); 

        this.renderer.render(this.scene, this.cameraController.getCamera)
    }
}