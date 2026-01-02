import { UPDATE_ORDER, DISPOSE_ORDER } from './AppConfig';
import { buildWorld } from './WorldBuilder';
import { validateSystems } from './SystemsValidator';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export class SystemsRegistry {
    private readonly systems: Record<string, any>;
    private readonly stats: Stats;

    constructor(systems: Record<string, any>) {
        validateSystems(systems);
        this.systems = systems;
        this.stats = new Stats();
        this.stats.showPanel(0); 
        document.body.appendChild(this.stats.dom);
    }

    public buildWorld(): void {
        const controller = this.systems.gameObjectsController;
        buildWorld(controller);
    }

    public update(deltaTime: number): void {
        this.stats.begin();
        const camera = this.systems.cameraController.cameraInstance;

        UPDATE_ORDER.forEach((key) => {
            if (key === 'gameObjectsController') {
                this.systems[key].update(deltaTime, camera);
            } else {
                this.systems[key].update(deltaTime);
            }
        });

        this.render();

        this.stats.end();
        this.stats.update();
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