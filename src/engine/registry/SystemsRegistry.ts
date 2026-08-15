import * as THREE from 'three';
import { UPDATE_ORDER, DISPOSE_ORDER } from '../kernel/Config';
import { validateSystems } from './SystemsRegistryValidator';
import { buildWorld } from '../../world/logic/WorldBuilder';
import type { WindService } from '../../world/wind/WindService';

export class SystemsRegistry {
    private readonly systems: Record<string, any>;
    private readonly clock = new THREE.Clock();
    private timeSinceLastUpdate: number = 0;
    private readonly targetInterval: number = 1 / 30;

    constructor(systems: Record<string, any>) {
        validateSystems(systems);
        this.systems = systems;
        buildWorld(this.systems.gameObjectsController, this.systems.windService);
        
        this.systems.sceneController.sceneInstance.traverse((obj: { name: any; count: any; geometry: { attributes: { position: { count: any; }; }; }; }) => {
            if (obj instanceof THREE.InstancedMesh) {
                console.log(
                    `- InstancedMesh: ${obj.name || '(unnamed)'} ` +
                    `| instances: ${obj.count} ` +
                    `| geometry verts per instance: ${obj.geometry.attributes.position?.count || '?'}`
                );
            }
        });
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

    public getWindService(): WindService {
    return this.systems.windService as WindService;
    }

    public dispose(): void {
        DISPOSE_ORDER.forEach((key) => {
            this.systems[key].dispose();
        });
    }
}