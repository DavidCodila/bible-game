import * as THREE from 'three';
import type { GrassPatch } from '../../patch/GrassPatch';
import type { MeshGameObject } from '../../../app/types';
import type { LODLevel } from './types';

export class GrassLODPatch implements MeshGameObject {
    public currentPatch: GrassPatch;
    public currentLODLevel: LODLevel;
    public cachedDistanceSquared: number = 0;
    public readonly worldPosition: THREE.Vector3;
    public readonly id: string;
    
    constructor(
        initialPatch: GrassPatch,
        worldPosition: THREE.Vector3,
        initialLOD: LODLevel = 'high'
    ) {
        this.currentPatch = initialPatch;
        this.worldPosition = worldPosition.clone();
        this.currentLODLevel = initialLOD;
        this.currentPatch.mesh.position.copy(this.worldPosition);
        this.id = `patch_${this.worldPosition.x}_${this.worldPosition.z}`;
    }

    public setDistanceSquared(distanceSquared: number) {
        this.cachedDistanceSquared = distanceSquared; 
        this.mesh.renderOrder = distanceSquared;
    }
    
    public get mesh(): THREE.Mesh {
        return this.currentPatch.mesh;
    }
    
    public swapPatch(newPatch: GrassPatch, newLODLevel: LODLevel): void {
        const oldRenderOrder = this.currentPatch.mesh.renderOrder;
        this.currentPatch = newPatch;
        this.currentLODLevel = newLODLevel;
        this.currentPatch.mesh.position.copy(this.worldPosition);
        this.currentPatch.mesh.renderOrder = oldRenderOrder;
    }
    
    public update(elapsedTime: number): void {
        this.currentPatch.update(elapsedTime);
    }

    dispose(): void {
        this.currentPatch.dispose();
    }
}