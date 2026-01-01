import { UPDATE_ORDER, DISPOSE_ORDER } from './AppConfig';
import { buildWorld } from './WorldBuilder';

export class SystemsRegistry {
    private readonly instances: Record<string, any>;

    constructor(instances: Record<string, any>) {
        this.instances = instances;
    }

    public buildWorld(): void {
        const controller = this.instances.gameObjectsController;
        buildWorld(controller);
    }

    public update(deltaTime: number): void {
        UPDATE_ORDER.forEach((key) => {
            this.instances[key].update(deltaTime);
        });
    }

    public render(): void {
        const renderer = this.instances.rendererController;
        const scene = this.instances.sceneController.sceneInstance;
        const camera = this.instances.cameraController.cameraInstance;

        renderer.render(scene, camera);
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.instances[key].dispose();
        });
    }
}