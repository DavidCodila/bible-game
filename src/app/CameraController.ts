import * as THREE from 'three';
import { InputManager } from './InputManager';

export class CameraController {
    private inputManager: InputManager;
    private camera: THREE.PerspectiveCamera;

    private readonly mouseSensitivity = 0.002;

    constructor(camera: THREE.PerspectiveCamera, inputManager: InputManager) {
        this.camera = camera;
        this.inputManager = inputManager;
        this.setupCamera();
    }

    private setupCamera(): void {
        this.camera.fov = 75;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.near = 0.1;
        this.camera.far = 1000;
        this.camera.position.set(0, 1.8, 1);
        this.camera.rotation.order = 'YXZ';
        this.camera.updateProjectionMatrix();
    }

    public update(): void {
        if (this.inputManager.mouseHasNotMoved) return;        

        this.camera.rotation.y -= this.inputManager.mouseDeltaX * this.mouseSensitivity;
        
        // Clamp Pitch to prevent looking upside down
        this.camera.rotation.x = Math.max(
            -Math.PI / 2, 
            Math.min(Math.PI / 2, this.camera.rotation.x - this.inputManager.mouseDeltaY * this.mouseSensitivity)
        );

        this.inputManager.resetDeltas();
    }

    public resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    public get getCamera(): THREE.PerspectiveCamera { return this.camera; }

}