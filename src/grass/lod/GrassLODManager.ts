import * as THREE from 'three';
import { GrassPatch } from '../patch/GrassPatch';
import { GrassLODPatch } from './GrassLODPatch';
import type { GameObjectsController } from '../../app/GameObjectsController';
import type { MeshGameObject } from '../../app/types';
import type { LODThresholds, LODLevel, Transition } from './types';
import { GRASS_GRID_CONFIG } from '../Constants';

export class GrassLODManager implements MeshGameObject {
    //need to remove this field...
    public mesh: THREE.Mesh;
    public readonly lodPatches: GrassLODPatch[] = [];
    private camera: THREE.Camera;
    private gameObjectsController: GameObjectsController;
    private frameCounter: number = 0;
    private poolHigh: GrassPatch[] = [];
    private poolMedium: GrassPatch[] = [];
    private poolLow: GrassPatch[] = [];
    private readonly updateInterval: number = 10;
    private activeTransitions: Map<string, Transition> = new Map();
    private transitionSpeed: number = 3;
    private lastTimestamp: number = 0;
    
    constructor(
        gameObjectsController: GameObjectsController,
        camera: THREE.Camera,
    ) {
        this.gameObjectsController = gameObjectsController;
        this.camera = camera;        
        this.mesh = new THREE.Mesh(
            new THREE.BufferGeometry(), 
            new THREE.MeshBasicMaterial()
        );
        
        this.prewarmPools();
        this.createPatchGrid(GRASS_GRID_CONFIG.patchesPerSide);
    }
    
    private prewarmPools(): void {
        for (let i = 0; i < 50; i++) {
            this.poolHigh.push(this.createPatch(GRASS_GRID_CONFIG.lodDensities.high));
            this.poolMedium.push(this.createPatch(GRASS_GRID_CONFIG.lodDensities.medium));
            this.poolLow.push(this.createPatch(GRASS_GRID_CONFIG.lodDensities.low));
        }
    }
    
    private createPatch(bladesPerRow: number): GrassPatch {
        return new GrassPatch({
            sideLength: GRASS_GRID_CONFIG.patchSize,
            bladesPerRow: bladesPerRow,
            grassBladeConfig: GRASS_GRID_CONFIG.grassBladeConfig,
            appearance: GRASS_GRID_CONFIG.appearance
        });
    }
    
    private createPatchGrid(gridSize: number): void {
        const halfGrid = gridSize / 2;
        const halfPatch = GRASS_GRID_CONFIG.patchSize / 2;
        
        for (let xIndex = 0; xIndex < gridSize; xIndex++) {
            for (let zIndex = 0; zIndex < gridSize; zIndex++) {
                const xOffset = (xIndex - halfGrid) * GRASS_GRID_CONFIG.patchSize + halfPatch;
                const zOffset = (zIndex - halfGrid) * GRASS_GRID_CONFIG.patchSize + halfPatch;
                
                const worldPosition = new THREE.Vector3(xOffset, 0, zOffset); //need to change when adding hills
                
                const initialPatch = this.getPatchFromPool('high');
                const lodPatch = new GrassLODPatch(initialPatch, worldPosition, 'high');

                lodPatch.mesh.frustumCulled = true;
                
                this.gameObjectsController.add(lodPatch);
                this.lodPatches.push(lodPatch);
            }
        }
    }
    
    private getPatchFromPool(lodLevel: LODLevel): GrassPatch {
        const pool = this.getPool(lodLevel);
        const density = GRASS_GRID_CONFIG.lodDensities[lodLevel];
        return pool.pop() || this.createPatch(density);
    }
    
    private returnToPool(patch: GrassPatch, lodLevel: LODLevel): void {
        const pool = this.getPool(lodLevel);
        if (pool.length < 100) {
            pool.push(patch);
        } else {
            patch.dispose();
        }
    }
    
    private getPool(lodLevel: LODLevel): GrassPatch[] {
        if (lodLevel === 'high') return this.poolHigh;
        if (lodLevel === 'medium') return this.poolMedium;
        return this.poolLow;
    }
    
    public update(elapsedTime: number): void {
        const deltaTime = this.lastTimestamp === 0 ? 0 : (elapsedTime - this.lastTimestamp);
        this.lastTimestamp = elapsedTime;
        
        this.updateTransitions(deltaTime);
        for (const lodPatch of this.lodPatches) {
            if (!lodPatch.mesh.visible) continue;
            lodPatch.update(elapsedTime);
        }
        this.frameCounter++;
        
        if (this.frameCounter != this.updateInterval) return; 
        this.frameCounter = 0;
        
        const cameraPosition = this.camera.position;
        
        for (const lodPatch of this.lodPatches) {
            if (!lodPatch.mesh.visible) continue;

            // Skip distance check if this patch is already busy transitioning
            if (this.activeTransitions.has(lodPatch.id)) continue;
            
            const distance = cameraPosition.distanceTo(lodPatch.worldPosition);
            const targetLOD = this.calculateLODLevel(
                distance, 
                lodPatch.currentLODLevel, 
                GRASS_GRID_CONFIG.lodThresholds
            );
            
            if (targetLOD !== lodPatch.currentLODLevel) {
                this.swapPatchLOD(lodPatch, targetLOD);
            }
        }
    }

    private calculateLODLevel(
    distance: number, 
    currentLOD: LODLevel, 
    thresholds: LODThresholds
    ): LODLevel {
        if (currentLOD === 'high') {
            return distance > thresholds.highToMedium ? 'medium' : 'high';
        }
        
        if (currentLOD === 'medium') {
            if (distance < thresholds.mediumToHigh) return 'high';
            if (distance > thresholds.mediumToLow) return 'low';
            return 'medium';
        }
        
        return distance < thresholds.lowToMedium ? 'medium' : 'low';
    }
    
    private swapPatchLOD(lodPatch: GrassLODPatch, newLODLevel: LODLevel): void {
        const oldPatch = lodPatch.currentPatch;
        const oldLODLevel = lodPatch.currentLODLevel;
        
        const newPatch = this.getPatchFromPool(newLODLevel);
        
        newPatch.setDissolve(0.0); // Start at 0 height
        newPatch.mesh.position.copy(lodPatch.worldPosition);
        this.gameObjectsController.sceneController.sceneInstance.add(newPatch.mesh);
        
        this.activeTransitions.set(lodPatch.id, {
            outgoing: oldPatch,
            incoming: newPatch,
            outgoingLevel: oldLODLevel,
            targetLevel: newLODLevel,
            lodPatchRef: lodPatch,
            progress: 0
        });

    }
    
    private updateTransitions(deltaTime: number): void {
        if (this.activeTransitions.size === 0) return;
    
        this.activeTransitions.forEach((transition, patchId) => {
            // At 30FPS, deltaTime is ~0.033. 
            // 0.033 * 3.0 = 0.1 progress per frame (10 frames total).
            transition.progress += deltaTime * this.transitionSpeed;
    
            if (transition.progress >= 1.0) {
                // 1. Finalize the visual state
                transition.incoming.setDissolve(1.0);
                
                // 2. Officially swap the reference in the LOD container
                transition.lodPatchRef.swapPatch(transition.incoming, transition.targetLevel);
                
                // 3. Cleanup: Remove old mesh and return to pool
                this.gameObjectsController.sceneController.sceneInstance.remove(transition.outgoing.mesh);
                this.returnToPool(transition.outgoing, transition.outgoingLevel);
                
                // 4. Remove from active tracking
                this.activeTransitions.delete(patchId);
            } else {
                // STOCHASTIC FADE LOGIC:
                // Instead of sine/cosine curves, we use linear progress.
                // The shader's 'discard' logic handles the "percentage of pixels" look.
                
                const incomingVisibility = transition.progress;
                const outgoingVisibility = 1.0 - transition.progress;
    
                transition.incoming.setDissolve(incomingVisibility);
                transition.outgoing.setDissolve(outgoingVisibility);
            }
        });
    }
    
    public dispose(): void {        
        this.poolHigh.forEach(patch => patch.dispose());
        this.poolMedium.forEach(patch => patch.dispose());
        this.poolLow.forEach(patch => patch.dispose());
        
        this.poolHigh = [];
        this.poolMedium = [];
        this.poolLow = [];
    }
}