import * as THREE from 'three';
import { UPDATE_ORDER, DISPOSE_ORDER } from './AppConfig';
import { validateSystems } from './SystemsValidator';
import { buildWorld } from './WorldBuilder';

export class SystemsRegistry {
    private readonly systems: Record<string, any>;
    private readonly clock = new THREE.Clock();
    private timeSinceLastUpdate: number = 0;
    private readonly targetInterval: number = 1 / 30;

    constructor(systems: Record<string, any>) {
        validateSystems(systems);
        this.systems = systems;
        buildWorld(this.systems.gameObjectsController);
    }

    public tick(): void {
        const deltaTime = this.clock.getDelta();
        this.timeSinceLastUpdate += deltaTime;

        if (this.timeSinceLastUpdate < this.targetInterval) return;
        const totalElapsedTime = this.clock.getElapsedTime();
        
        for (const key of UPDATE_ORDER) {
            this.systems[key].update(totalElapsedTime);
        }

        this.render();
        this.timeSinceLastUpdate %= this.targetInterval;
    }

    public render(): void {
        const renderer = this.systems.rendererController;
        const scene = this.systems.sceneController.sceneInstance;
        const camera = this.systems.cameraController.camera;

        renderer.render(scene, camera);
    }

    public startMusic(): void {
        this.systems.audioController.play();
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.systems[key].dispose();
        });
    }
}