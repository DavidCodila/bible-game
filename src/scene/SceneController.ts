import * as THREE from 'three';
import type { DisposableObject } from '../app/types';

export class SceneController implements DisposableObject {
    private scene: THREE.Scene;

    constructor(scene : THREE.Scene) {
        this.scene = scene;
        this.setupScene();
    }

    public add(...objects: THREE.Object3D[]): void {
        this.scene.add(...objects);
    }

    private setupScene(): void {
        this.scene.background = new THREE.Color(0x87ceeb); //need to change colour here and in test later...
    }

    public get sceneInstance(): THREE.Scene { return this.scene; }

    public dispose(): void {
        this.scene.background = null;
        this.scene.clear();
    }

}