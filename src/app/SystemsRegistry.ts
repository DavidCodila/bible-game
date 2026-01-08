import { UPDATE_ORDER, DISPOSE_ORDER } from './AppConfig';
import { buildWorld } from './WorldBuilder';
import { validateSystems } from './SystemsValidator';

export class SystemsRegistry {
    private readonly systems: Record<string, any>;

    constructor(systems: Record<string, any>) {
        validateSystems(systems);
        this.systems = systems;
    }

    public buildWorld(): void {
        const controller = this.systems.gameObjectsController;
        buildWorld(controller);
    }

    public update(elapsedTime: number): void {
        for (const key of UPDATE_ORDER) {
            this.systems[key].update(elapsedTime);
        }
    
        this.render();
    }

    public render(): void {
        const renderer = this.systems.rendererController;
        const scene = this.systems.sceneController.sceneInstance;
        const camera = this.systems.cameraController.camera;

        renderer.render(scene, camera);
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.systems[key].dispose();
        });
    }
}