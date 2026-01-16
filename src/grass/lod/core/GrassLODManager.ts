import * as THREE from 'three';
import { GrassLODOrchestrator } from './GrassLODOrchestrator';
import { GrassUpdateScheduler } from '../services/GrassUpdateScheduler';
import { GrassLODProcessor } from './GrassLODProcessor';
import { createGrassLODPatchesForGrid } from '../utils/GridCreator';
import type { GameObjectsController } from '../../../app/GameObjectsController';
import type { GrassLODPatch } from '../model/GrassLODPatch';

export class GrassLODManager {
    private readonly lodPatches: GrassLODPatch[];
    private visiblePatches: GrassLODPatch[];
    private visibleCount = 0;
    private lastTimestamp = 0;

    private camera: THREE.Camera
    private orchestrator: GrassLODOrchestrator;
    private scheduler = new GrassUpdateScheduler(4, 9);

    constructor(controller: GameObjectsController, camera: THREE.Camera) {
        this.camera = camera;
        this.orchestrator = new GrassLODOrchestrator(controller);
        this.lodPatches = createGrassLODPatchesForGrid();
        
        controller.add(...this.lodPatches);
        this.visiblePatches = new Array(this.lodPatches.length);
    }

    public update(elapsedTime: number): void {
        const deltaTime = elapsedTime - (this.lastTimestamp || elapsedTime);
        this.lastTimestamp = elapsedTime;

        this.orchestrator.update(deltaTime);

        this.scheduler.run(
            () => this.visibleCount = GrassLODProcessor.updateSpatialState(
                this.camera, 
                this.lodPatches, 
                this.visiblePatches
            ),
            () => GrassLODProcessor.evaluateTransitions(
                this.visiblePatches, 
                this.visibleCount, 
                this.orchestrator
            )
        );
    }

    public dispose(): void {}
}