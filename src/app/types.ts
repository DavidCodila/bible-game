import * as THREE from 'three';

export interface InputState {
    mouseDeltaX: number;
    mouseDeltaY: number;
    wKeyPressed: boolean;
    sKeyPressed: boolean;
    aKeyPressed: boolean;
    dKeyPressed: boolean;
    spaceKeyPressed: boolean;
}

export interface MeshGameObject {
    mesh: THREE.Mesh;
    update(elapsedTime: number): void;
    dispose(): void;
}

export interface DisposableObject {
    dispose(): void
}
