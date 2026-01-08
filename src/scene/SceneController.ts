import * as THREE from 'three';
import type { DisposableObject } from '../app/types';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class SceneController implements DisposableObject {
    private scene: THREE.Scene;
    private sky: Sky;
    private sunPosition: THREE.Vector3;
    private directionalLight: THREE.DirectionalLight;

    constructor(scene : THREE.Scene) {
        this.scene = scene;
        this.sunPosition = new THREE.Vector3();
        this.sky = new Sky();
        
        // Sun Light
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.directionalLight.castShadow = true;
        
        this.setupScene();
    }

    public add(...objects: THREE.Object3D[]): void {
        this.scene.add(...objects);
    }

    private setupScene(): void {
        // 1. SKY CONFIGURATION
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        const skyUniforms = this.sky.material.uniforms;
        
        // SUMMER MORNING SETTINGS:
        // Lower turbidity (2.0) = Clear, non-polluted summer air
        skyUniforms['turbidity'].value = 2.0; 
        // Rayleigh (3.0) = Enhances the blue of the sky and the redness of the sun
        skyUniforms['rayleigh'].value = 3.0;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.7;

        // 2. SUN POSITION (Early Morning)
        // elevation 2.0 = Just above the horizon line
        const elevation = 2.0; 
        const azimuth = 180;
        
        const phi = THREE.MathUtils.degToRad(90 - elevation);
        const theta = THREE.MathUtils.degToRad(azimuth);

        this.sunPosition.setFromSphericalCoords(1, phi, theta);
        skyUniforms['sunPosition'].value.copy(this.sunPosition);

        // 3. LIGHTING SYNCHRONIZATION
        this.directionalLight.position.copy(this.sunPosition);
        // Golden morning hue
        this.directionalLight.color.setHSL(0.1, 0.8, 0.8); 
        
        this.scene.add(this.directionalLight);
        //this.scene.add(this.ambientLight);

        // Optional: Scene Fog helps blend the ground into the horizon
        this.scene.fog = new THREE.FogExp2(0xd0e0f0, 0.002);
        this.scene.background = new THREE.Color(0xd0e0f0);
    }

    public get sceneInstance(): THREE.Scene { return this.scene; }

    public dispose(): void {
        this.sky.material.dispose();
        this.sky.geometry.dispose();
        this.directionalLight.dispose();
        this.scene.remove(this.sky);
        this.scene.remove(this.directionalLight);
        this.scene.clear();
    }

}