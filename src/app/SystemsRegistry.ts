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

    public update(deltaTime: number): void {
        UPDATE_ORDER.forEach((key) => {
            this.systems[key].update(deltaTime);
        });
    }

    public render(): void {
        const renderer = this.systems.rendererController;
        const scene = this.systems.sceneController.sceneInstance;
        const camera = this.systems.cameraController.cameraInstance;

        renderer.render(scene, camera);
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.systems[key].dispose();
        });
    }
}