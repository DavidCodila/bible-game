import * as THREE from 'three';
import { StatsTracker } from './StatsTracker';
import { InputManager } from './InputManager';
import { GrassPatch } from './GrassPatch';

/**
 * The core application manager for the Garden of Eden environment.
 * Responsible for scene setup, core state, and the render loop orchestration.
 */
export class GardenOfEdenApp {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;

    // Module Dependencies
    private statsTracker: StatsTracker;
    private inputManager: InputManager;
    private grassPatch: GrassPatch;

    // Camera State
    private cameraYaw: number = 0;
    private cameraPitch: number = 0;
    private readonly mouseSensitivity = 0.002;

    constructor() {
        // CORE SETUP
        this.renderer = this.setupRenderer();
        this.scene = this.setupScene();
        this.camera = this.setupCamera();
        this.clock = new THREE.Clock();

        // MODULE INITIALIZATION
        this.statsTracker = new StatsTracker();
        this.inputManager = new InputManager(this.renderer.domElement);
        
        // ENVIRONMENT SETUP
        this.addGround();
        this.grassPatch = new GrassPatch();
        this.scene.add(this.grassPatch.mesh);

        // START
        this.setupWindowListeners();
        this.animate();
    }

    private setupScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        return scene;
    }

    private setupCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.8, 1);
        camera.rotation.order = 'YXZ';
        return camera;
    }

    private setupRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    private addGround(): void {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0x3d2817 })
        );
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
    }

    private setupWindowListeners(): void {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private updateCameraRotation(): void {
        // 1. READ INPUT
        const deltaYaw = this.inputManager.mouseDeltaX;
        const deltaPitch = this.inputManager.mouseDeltaY;

        if (deltaYaw === 0 && deltaPitch === 0) {
            return; 
        }

        // 2. APPLY LOGIC (Rotation)
        this.cameraYaw -= deltaYaw * this.mouseSensitivity;
        
        // Clamp Pitch to prevent looking upside down (horizon to horizon)
        this.cameraPitch = Math.max(
            -Math.PI / 2, 
            Math.min(Math.PI / 2, this.cameraPitch - deltaPitch * this.mouseSensitivity)
        );

        this.camera.rotation.y = this.cameraYaw;
        this.camera.rotation.x = this.cameraPitch;

        // 3. RESET INPUT STATE
        this.inputManager.resetDeltas();
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        // 1. UPDATE LOGIC (Orchestration)
        this.statsTracker.update(); 
        this.updateCameraRotation(); 
        this.grassPatch.update(deltaTime); 

        // 2. RENDER
        this.renderer.render(this.scene, this.camera);
    }
}