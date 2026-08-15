import * as THREE from 'three';
import type { DisposableObject } from '../../types/engine';
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
    
    public remove(...objects: THREE.Object3D[]): void {
        this.scene.remove(...objects);
    }

    private setupScene(): void {
        this.directionalLight.position.copy(SUN_DIRECTION);
        this.directionalLight.color.setHSL(0.1, 0.8, 0.8); 
        this.directionalLight.intensity = 2;
        const light2 : THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        const opositeLight = new THREE.Vector3();
        const light3 : THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        const opositeLeftLight = new THREE.Vector3();
        const light4 : THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        const opositeRightLight = new THREE.Vector3();
        opositeLeftLight.set(-SUN_DIRECTION.x,SUN_DIRECTION.y,SUN_DIRECTION.z);
        opositeRightLight.set(SUN_DIRECTION.x,SUN_DIRECTION.y,-SUN_DIRECTION.z);
        opositeLight.set(-SUN_DIRECTION.x,-SUN_DIRECTION.y,-SUN_DIRECTION.z);
        light2.position.copy(opositeLight)
        this.directionalLight.castShadow = false;
        light2.castShadow = false;
        light3.castShadow = false;
        light4.castShadow = false;
        this.scene.add(this.directionalLight);
        this.scene.add(light2);
        this.scene.add(light3);
        this.scene.add(light4);
        //this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }

    public get sceneInstance(): THREE.Scene { return this.scene; }

    public dispose(): void {
        this.directionalLight.dispose();
        this.scene.remove(this.directionalLight);
        this.scene.clear();
    }
}