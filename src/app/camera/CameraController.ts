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
    private movementSpeed: number = 0.04;
    

    constructor(camera: THREE.PerspectiveCamera, inputManager : InputManager) {
        this.camera = camera;
        this.inputManager = inputManager;
    }

    public update(): void {
        this.processInput();
        this.processMovement();
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

    private processMovement(): void {
        const input = this.inputManager.inputStateReference;
        const forwardVector = new THREE.Vector3();
        const rightVector = new THREE.Vector3();
        let movementSpeed = input.spaceKeyPressed 
        ? this.movementSpeed * 1.8
        : this.movementSpeed;

        this.camera.getWorldDirection(forwardVector);
        
        forwardVector.y = 0; //need to change when adding hills
        forwardVector.normalize();

        rightVector.crossVectors(forwardVector, this.camera.up).normalize();

        if (input.wKeyPressed) this.camera.position.addScaledVector(forwardVector, movementSpeed);
        if (input.sKeyPressed) this.camera.position.addScaledVector(forwardVector, -movementSpeed);
        if (input.aKeyPressed) this.camera.position.addScaledVector(rightVector, -movementSpeed);
        if (input.dKeyPressed) this.camera.position.addScaledVector(rightVector, movementSpeed);
    }

    public resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    dispose(): void {}
}