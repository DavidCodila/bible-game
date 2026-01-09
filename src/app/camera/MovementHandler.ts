import * as THREE from 'three';
import type { InputManager } from "../InputManager";

export class MovementHandler {
    private inputManager: InputManager;
    private rightVector: THREE.Vector3 = new THREE.Vector3();
    private movementSpeed: number = 0.04;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    public handleMovement(camera: THREE.PerspectiveCamera, forwardVector: THREE.Vector3): void {
        const input = this.inputManager.inputMovementStateReference;
        
        let movementSpeed = input.spaceKeyPressed 
        ? this.movementSpeed * 1.8
        : this.movementSpeed;
        
        forwardVector.y = 0;

        this.rightVector.crossVectors(forwardVector, camera.up).normalize();

        if (input.wKeyPressed) camera.position.addScaledVector(forwardVector, movementSpeed);
        if (input.sKeyPressed) camera.position.addScaledVector(forwardVector, -movementSpeed);
        if (input.aKeyPressed) camera.position.addScaledVector(this.rightVector, -movementSpeed);
        if (input.dKeyPressed) camera.position.addScaledVector(this.rightVector, movementSpeed);
    }
}