import * as THREE from 'three';
import { LookHandler } from './LookHandler';
import type { DisposableObject } from "../types";
import type { MovementHandler } from './MovementHandler';

export class CameraController implements DisposableObject {
    public readonly camera: THREE.PerspectiveCamera;
    private lookHandler: LookHandler;
    private movementHandler: MovementHandler;
    
    constructor(camera: THREE.PerspectiveCamera, lookHandler: LookHandler, movementHandler: MovementHandler) {
        this.camera = camera;
        this.lookHandler = lookHandler;
        this.movementHandler = movementHandler;
    }

    public update(): void {
        this.lookHandler.handleLook(this.camera);
        this.movementHandler.handleMovement(this.camera, this.lookHandler.forwardVector);
    }

    public resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    dispose(): void {}
}