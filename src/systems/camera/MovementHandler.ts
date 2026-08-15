import * as THREE from 'three';
import type { InputManager } from "../input/InputManager";
import { TerrainHeightService } from '../../world/terrain/services/TerrainHeightService';

export class MovementHandler {
    private inputManager: InputManager;
    private rightVector: THREE.Vector3 = new THREE.Vector3();
    private movementSpeed: number = 0.04;
    private readonly PLAYER_EYE_HEIGHT: number = 2.0;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    public handleMovement(camera: THREE.PerspectiveCamera, forwardVector: THREE.Vector3): void {
        const input = this.inputManager.inputMovementStateReference;
        
        let movementSpeed = input.spaceKeyPressed 
        ? this.movementSpeed * 3
        : this.movementSpeed;
        
        forwardVector.y = 0;

        this.rightVector.crossVectors(forwardVector, camera.up).normalize();

        if (input.wKeyPressed) camera.position.addScaledVector(forwardVector, movementSpeed);
        if (input.sKeyPressed) camera.position.addScaledVector(forwardVector, -movementSpeed);
        if (input.aKeyPressed) camera.position.addScaledVector(this.rightVector, -movementSpeed);
        if (input.dKeyPressed) camera.position.addScaledVector(this.rightVector, movementSpeed);

        const groundHeight = TerrainHeightService.getHeight(camera.position.x, camera.position.z);
        const targetY = groundHeight + this.PLAYER_EYE_HEIGHT;

        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    }
}