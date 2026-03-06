import * as THREE from 'three';
import { SystemsRegistry } from '../registry/SystemsRegistry';
import type { DisposableObject } from '../../types/engine';
import { OverlayController } from '../../ui/overlays/OverlayController';
import { AppBootstrapper } from './Bootstrapper';
import { AppLoop } from './Loop';
// In GardenOfEdenApp or after SystemsRegistry is created
import { WindDebugUI } from '../../ui/debug/WindDebugUI';

// Inside startGame callback or after registry is ready:

let  windDebug: WindDebugUI;
// Toggle with key (e.g. `~` key)
window.addEventListener('keydown', (e) => {
  if (e.key === '`' || e.key === '~') {
    windDebug.toggle();
  }
});

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
        windDebug = new WindDebugUI(registry.getWindService());
        
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