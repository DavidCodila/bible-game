import * as THREE from 'three';
import { assembleSystemsRegistry } from './AppFactory';
import { SystemsRegistry } from './SystemsRegistry';
import type { DisposableObject } from './types';
import { OverlayController } from './OverlayController';

//to do: make headge around garden with endless wilderness after hedge
export class GardenOfEdenApp implements DisposableObject {
    private readonly clock = new THREE.Clock();
    private registry?: SystemsRegistry;
    private animationFrameId: number = 0;
    private isRunning: boolean = true;
    private isInitialized: boolean = false;
    private hasPressedPlay: boolean = false;

    constructor() {
        this.init();
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    private async init(): Promise<void> {
        try {
            this.registry = await assembleSystemsRegistry();
            this.isInitialized = true;
            
            if (this.hasPressedPlay) {
                this.startGame();
            }
        } catch (error) {
            console.error("Failed to initialize game systems:", error);
        }
    }

    public play(): void {
        this.hasPressedPlay = true;
        
        if (this.isInitialized) {
            this.startGame();
        }
    }

    private startGame(): void {
        this.clock.start();
        this.registry?.startMusic();
        OverlayController.startFadeSequence();
        this.animate();
    }

    private animate = () => {
        if (!this.isRunning) return;
        this.animationFrameId = requestAnimationFrame(this.animate);
        this.registry?.tick();
    }

    private handleBeforeUnload = () => {
        this.dispose();
    }

    public dispose(): void {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.registry?.dispose();
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}