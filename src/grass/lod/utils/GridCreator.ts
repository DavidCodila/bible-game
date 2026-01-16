import * as THREE from 'three';
import { GRASS_GRID_CONFIG } from "../../Constants";
import { GrassLODPatch } from "../model/GrassLODPatch";
import GrassPool from '../services/GrassPool';

export function createGrassLODPatchesForGrid(): GrassLODPatch[] {
    const grassLODPatchs : GrassLODPatch[] = new Array()
    const halfGrid = GRASS_GRID_CONFIG.patchesPerSide / 2;
    const halfPatch = GRASS_GRID_CONFIG.patchSize / 2;
    
    for (let xIndex = 0; xIndex < GRASS_GRID_CONFIG.patchesPerSide; xIndex++) {
        for (let zIndex = 0; zIndex < GRASS_GRID_CONFIG.patchesPerSide; zIndex++) {
            const xOffset = (xIndex - halfGrid) * GRASS_GRID_CONFIG.patchSize + halfPatch;
            const zOffset = (zIndex - halfGrid) * GRASS_GRID_CONFIG.patchSize + halfPatch;
            
            const worldPosition = new THREE.Vector3(xOffset, 0, zOffset);
            
            const initialPatch = GrassPool.getPatch('high');
            const lodPatch = new GrassLODPatch(initialPatch, worldPosition, 'high'); 

            lodPatch.mesh.frustumCulled = true; 
            grassLODPatchs.push(lodPatch);
        }
    }

    return grassLODPatchs;
}