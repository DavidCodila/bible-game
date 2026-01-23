import type { Scene } from 'three';
import { UPDATE_ORDER, DISPOSE_ORDER } from './AppConfig';
import { validateSystems } from './SystemsValidator';
import { buildWorld } from './WorldBuilder';

export class SystemsRegistry {
    private readonly systems: Record<string, any>;

    constructor(systems: Record<string, any>) {
        validateSystems(systems);
        this.systems = systems;
        this.buildWorld();
    }

    public update(elapsedTime: number): void {
        for (const key of UPDATE_ORDER) {
            this.systems[key].update(elapsedTime);
        }
    
        this.render();
    }

    public buildWorld(): void {
        const controller = this.systems.gameObjectsController;
        buildWorld(controller);
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

    public getScene(): Scene {
        return this.systems.sceneController.sceneInstance;
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.systems[key].dispose();
        });
    }
}