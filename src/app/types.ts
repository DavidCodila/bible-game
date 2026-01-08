export interface InputState {
    mouseDeltaX: number;
    mouseDeltaY: number;
    // Keys to be added later for movement
    isWPressed: boolean;
    isSPressed: boolean;
    isAPressed: boolean;
    isDPressed: boolean;
}

export interface MeshGameObject {
    mesh: THREE.Mesh;
    update(deltaTime: number): void;
    dispose(): void;
}

export interface DisposableObject {
    dispose(): void
}
