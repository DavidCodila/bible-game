import * as THREE from 'three';
import { clamp } from '../../utils/GeometryUtils';
import type { InputManager } from "../input/InputManager";
import { assignForwardVector } from '../../utils/GeometryUtils';

const SENSITIVITY = 0.002;
const DAMPING = 0.15;
const SKY_LIMIT = -Math.PI / 2;
const GROUND_LIMIT = Math.PI / 2;

export class LookHandler {
    public readonly forwardVector: THREE.Vector3 = new THREE.Vector3();
    private inputManager : InputManager;
    private currentYaw = 0; 
    private targetYaw = 0;
    private currentPitch = 0; 
    private targetPitch = 0;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    public handleLook(camera: THREE.PerspectiveCamera) : void {
        if (this.inputManager.mouseHasMoved) {
            this.processInput();
            this.inputManager.resetDeltas();
        }

        this.applyDamping();
        assignForwardVector(this.forwardVector, this.currentYaw); // used to mitagate the need for .getWorldDirection() in movement calculations
        camera.rotation.set(this.currentPitch, this.currentYaw, 0);
    }

    private processInput(): void {
        this.targetYaw -= this.inputManager.mouseDeltaX * SENSITIVITY;
        const newPitch = this.targetPitch - this.inputManager.mouseDeltaY * SENSITIVITY;
        this.targetPitch = clamp(newPitch, SKY_LIMIT, GROUND_LIMIT);
    }

    private applyDamping(): void {
        this.currentYaw += (this.targetYaw - this.currentYaw) * DAMPING;
        this.currentPitch += (this.targetPitch - this.currentPitch) * DAMPING;
    }
}