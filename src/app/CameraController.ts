import * as THREE from 'three';
import { InputManager } from './InputManager';

/**
 * Manages the camera's rotational state (yaw and pitch) based on mouse input.
 * Note: Assumes the camera's position is handled elsewhere or is static for simplicity.
 */
export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private inputManager: InputManager;

    // Camera State
    private cameraYaw: number = 0;
    private cameraPitch: number = 0;
    private readonly mouseSensitivity = 0.002;

    constructor(camera: THREE.PerspectiveCamera, inputManager: InputManager) {
        this.camera = camera;
        this.inputManager = inputManager;
        this.camera.rotation.order = 'YXZ'; 
    }

    /**
     * Updates the camera's rotation based on mouse delta input.
     */
    public update(): void {
        if (this.inputManager.mouseHasNotMoved) return; 

        const deltaYaw = this.inputManager.mouseDeltaX;
        const deltaPitch = this.inputManager.mouseDeltaY;        

        this.cameraYaw -= deltaYaw * this.mouseSensitivity;
        
        // Clamp Pitch to prevent looking upside down
        this.cameraPitch = Math.max(
            -Math.PI / 2, 
            Math.min(Math.PI / 2, this.cameraPitch - deltaPitch * this.mouseSensitivity)
        );

        this.camera.rotation.y = this.cameraYaw;
        this.camera.rotation.x = this.cameraPitch;

        this.inputManager.resetDeltas();
    }
}