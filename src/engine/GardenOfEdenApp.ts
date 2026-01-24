import * as THREE from 'three';
import { SystemsRegistry } from './SystemsRegistry';
import type { DisposableObject } from '../types/engine';
import { OverlayController } from '../ui/overlays/OverlayController';
import { AppBootstrapper } from './AppBootstrapper';
import { AppLoop } from './AppLoop';

// To do: make hedge around garden with endless wilderness after hedge
export class GardenOfEdenApp implements DisposableObject {
    private readonly clock = new THREE.Clock();
    private readonly bootstrapper = new AppBootstrapper();
    private readonly loop = new AppLoop();
    private registry?: SystemsRegistry;

    constructor() {
        this.bootstrapper.load(this.startGame);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    public play(): void {
        this.bootstrapper.play(this.startGame);
    }

    private startGame = (registry: SystemsRegistry): void => {
        this.registry = registry;
        
        this.clock.start();
        this.registry.startMusic();
        
        OverlayController.startFadeSequence();

        this.loop.start(() => {
            registry.tick();
        });
    }

    private handleBeforeUnload = (): void => {
        this.dispose();
    }

    public dispose(): void {
        this.loop.stop();
        this.registry?.dispose();
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}