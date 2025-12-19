import * as THREE from 'three';

export class SceneController {
    private scene: THREE.Scene;

    constructor(scene : THREE.Scene) {
        this.scene = scene;
        this.setupScene();
    }

    public add(...objects: THREE.Object3D[]): void {
        this.scene.add(...objects);
    }

    private setupScene(): void {
        this.scene.background = new THREE.Color(0x87ceeb);
    }

    public get sceneInstance(): THREE.Scene { return this.scene; }

}