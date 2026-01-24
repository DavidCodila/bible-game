import * as THREE from 'three';
import { TransitionAssetFactory } from './TransitionAssetFactory';
import { TransitionAnimator } from './TransitionAnimator';

export class TransitionController {
    private static instance: TransitionController;
    private material!: THREE.ShaderMaterial;
    private mesh!: THREE.Mesh;
    private scene?: THREE.Scene;
    private isInitialised: boolean = false;

    private constructor() {}

    public static getInstance(): TransitionController {
        if (!TransitionController.instance) {
            TransitionController.instance = new TransitionController();
        }
        return TransitionController.instance;
    }

    public initialise(scene: THREE.Scene): void {
        if (this.isInitialised) return;
        this.scene = scene;
        this.material = TransitionAssetFactory.createMaterial();
        this.mesh = TransitionAssetFactory.createMesh(this.material);
        this.isInitialised = true;
    }

    public activate(): void {
        if (!this.isInitialised || !this.scene) return;

        this.scene.add(this.mesh);
        
        TransitionAnimator.start(this.material, () => {
            this.dispose();
        });
    }

    public onResize(width: number, height: number): void {
        if (this.isInitialised) {
            this.material.uniforms.uResolution.value.set(width, height);
        }
    }

    private dispose(): void {
        if (this.scene && this.mesh) {
            this.scene.remove(this.mesh);
        }
        this.material.dispose();
        this.mesh.geometry.dispose();
        this.isInitialised = false;
    }
}