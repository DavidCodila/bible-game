import * as THREE from 'three';
import { assembleSystemsRegistry } from './AppFactory';
import { SystemsRegistry } from './SystemsRegistry';
import type { DisposableObject } from './types';
import { TransitionController } from './TransitionController';

//to do: make headge around garden with endless wilderness after hedge
export class GardenOfEdenApp implements DisposableObject {
    private readonly clock = new THREE.Clock();
    private registry?: SystemsRegistry;
    private animationFrameId: number = 0;
    private isRunning: boolean = true;
    private isInitialized: boolean = false;
    private hasPressedPlay: boolean = false;

    private timeSinceLastFrame: number = 0;
    private targetFrameInterval: number = 1 / 30;

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
        const overlay = document.getElementById('ui-overlay');
        if (overlay) overlay.style.opacity = '0';
        this.hasPressedPlay = true;
        
        if (this.isInitialized) {
            this.startGame();
        }
    }

    private startGame(): void {
        this.clock.start();
        this.registry?.startMusic();
        this.animate();
        const overlayElement = document.getElementById('ui-overlay');
        if (overlayElement) {
            // 1. Start Shader
            TransitionController.getInstance().activate();

            // 2. Start CSS Fade
            overlayElement.style.transition = 'opacity 1s ease-out';
            overlayElement.style.opacity = '0';
            overlayElement.style.pointerEvents = 'none';

            // 3. Physical Removal (after fade is done)
            setTimeout(() => {
                overlayElement.remove();
                // Now lock the screen
                const canvas = document.querySelector('canvas');
                canvas?.requestPointerLock();
            }, 1500);
        }
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