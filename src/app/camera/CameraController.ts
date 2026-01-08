import * as THREE from 'three';
import { clamp } from '../../tools/GeometryUtils';
import { SENSITIVITY, DAMPING, SKY_LIMIT, GROUND_LIMIT } from "./Constants";
import type { InputManager } from "../InputManager";
import type { DisposableObject } from "../types";

export class CameraController implements DisposableObject {
    private currentYaw = 0; private targetYaw = 0;
    private currentPitch = 0; private targetPitch = 0;
    public readonly camera: THREE.PerspectiveCamera;
    private inputManager : InputManager;

    constructor(camera: THREE.PerspectiveCamera, inputManager : InputManager) {
        this.camera = camera;
        this.inputManager = inputManager;
    }

    public update(): void {
        this.processInput();
        this.applyDamping();
        this.camera.rotation.set(this.currentPitch, this.currentYaw, 0);
    }

    private processInput(): void {
        if (this.inputManager.mouseHasNotMoved) return;
        this.targetYaw -= this.inputManager.mouseDeltaX * SENSITIVITY;
        const newPitch = this.targetPitch - this.inputManager.mouseDeltaY * SENSITIVITY;
        this.targetPitch = clamp(newPitch, SKY_LIMIT, GROUND_LIMIT);
        this.inputManager.resetDeltas();
    }

    private applyDamping(): void {
        this.currentYaw += (this.targetYaw - this.currentYaw) * DAMPING;
        this.currentPitch += (this.targetPitch - this.currentPitch) * DAMPING;
    }

    public resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    dispose(): void {}
}