import * as THREE from 'three';

export interface InputMovementState {
    wKeyPressed: boolean;
    sKeyPressed: boolean;
    aKeyPressed: boolean;
    dKeyPressed: boolean;
    spaceKeyPressed: boolean;
}

export interface InputMouseState {
    mouseDeltaX: number;
    mouseDeltaY: number;
}

export interface MeshGameObject {
    mesh: THREE.Mesh;
    update(elapsedTime: number): void;
    dispose(): void;
}

export interface DisposableObject {
    dispose(): void
}
