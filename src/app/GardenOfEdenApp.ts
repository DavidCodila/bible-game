import * as THREE from 'three';
import { assembleSystemsRegistry } from './AppFactory';
import { SystemsRegistry } from './SystemsRegistry';
import type { DisposableObject } from './types';

//to do: make headge around garden with endless wilderness after hedge
export class GardenOfEdenApp implements DisposableObject {
    private readonly clock = new THREE.Clock();
    private readonly registry: SystemsRegistry;
    private animationFrameId: number = 0;
    private isRunning: boolean = true;

    constructor() {
        this.registry = assembleSystemsRegistry();

        window.addEventListener('beforeunload', this.handleBeforeUnload);
        
        this.registry.buildWorld();
        this.animate();
    }

    private animate = () => {
        if (!this.isRunning) return;
    
        this.animationFrameId = requestAnimationFrame(this.animate);
        const elapsedTime = this.clock.getElapsedTime();
    
        this.registry.update(elapsedTime);
    }

    private handleBeforeUnload = () => {
        this.dispose();
    }

    dispose(): void {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.registry.dispose();
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}