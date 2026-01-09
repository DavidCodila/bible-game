import * as THREE from 'three';
import type { DisposableObject } from '../app/types';
import { SkyConstructor } from './SkyConstructor';
import { SUN_DIRECTION } from './Constants';
export class SceneController implements DisposableObject {
    private scene: THREE.Scene;
    private directionalLight: THREE.DirectionalLight;
    

    constructor(scene : THREE.Scene) {
        this.scene = scene;
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.directionalLight.castShadow = true;
        this.scene.add(SkyConstructor.constructSky());
        this.setupScene();
    }

    public add(...objects: THREE.Object3D[]): void {
        this.scene.add(...objects);
    }

    private setupScene(): void {
        this.directionalLight.position.copy(SUN_DIRECTION);
        this.directionalLight.color.setHSL(0.1, 0.8, 0.8); 
        
        this.scene.add(this.directionalLight);
    }

    public get sceneInstance(): THREE.Scene { return this.scene; }

    public dispose(): void {
        this.directionalLight.dispose();
        this.scene.remove(this.directionalLight);
        this.scene.clear();
    }
}