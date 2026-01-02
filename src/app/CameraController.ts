import { InputManager } from './InputManager';
import { clamp } from 'three/src/math/MathUtils.js';
import type { DisposableObject } from './types';

export class CameraController implements DisposableObject {
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
        this.camera.position.set(0, 1.8, 0);
        this.camera.rotation.order = 'YXZ';
        this.camera.updateProjectionMatrix();
    }

    public update(): void {
        if (this.inputManager.mouseHasNotMoved) return;   
        const yaw = this.camera.rotation.y - this.inputManager.mouseDeltaX * this.mouseSensitivity;     
        const pitch = this.camera.rotation.x - this.inputManager.mouseDeltaY * this.mouseSensitivity;

        this.camera.rotation.y = yaw;        
        this.camera.rotation.x = clamp(pitch, -Math.PI / 2, Math.PI / 2);

        this.inputManager.resetDeltas();
    }

    public resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    public get cameraInstance(): THREE.PerspectiveCamera { return this.camera; }

    dispose(): void {}
}