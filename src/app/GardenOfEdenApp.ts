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

    private timeSinceLastFrame: number = 0;
    private targetFrameInterval: number = 1 / 30;

    constructor() {
        this.registry = assembleSystemsRegistry();

        window.addEventListener('beforeunload', this.handleBeforeUnload);
        
        this.registry.buildWorld();
        this.animate();
    }

    private animate = () => {
        if (!this.isRunning) return;
    
        this.animationFrameId = requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta();
        this.timeSinceLastFrame += deltaTime;
    
        if (this.timeSinceLastFrame >= this.targetFrameInterval) {
            const totalElapsedTime = this.clock.getElapsedTime();
            
            this.registry.update(totalElapsedTime);
            
            this.timeSinceLastFrame %= this.targetFrameInterval;
        }
    
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