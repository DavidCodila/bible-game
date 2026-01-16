import { GRASS_GRID_CONFIG } from "../../Constants";
import type { GrassPatch } from "../../patch/GrassPatch";
import { MAX_POOL_SIZE, PATCHES_PER_POOL } from "../Constants";
import { createPatch } from "../../Constants";
import type { LODLevel } from "../model/types";

class GrassPool {
    private poolHigh: GrassPatch[] = [];
    private poolMedium: GrassPatch[] = [];
    private poolLow: GrassPatch[] = [];
    
    constructor() {
        for (let index = 0; index < PATCHES_PER_POOL; index++) {
            this.poolHigh.push(createPatch(GRASS_GRID_CONFIG.lodDensities.high));
            this.poolMedium.push(createPatch(GRASS_GRID_CONFIG.lodDensities.medium));
            this.poolLow.push(createPatch(GRASS_GRID_CONFIG.lodDensities.low));
        }
    }

    public getPool(lodLevel: LODLevel): GrassPatch[] {
        if (lodLevel === 'high') return this.poolHigh;
        if (lodLevel === 'medium') return this.poolMedium;
        return this.poolLow;
    }

    public getPatch(lodLevel: LODLevel): GrassPatch {
        const targetPool = this.getPool(lodLevel);
        const density = GRASS_GRID_CONFIG.lodDensities[lodLevel];
        
        return targetPool.pop() || createPatch(density);
    }

    public returnPatch(grassPatch: GrassPatch, lodLevel: LODLevel): void {
        const targetPool = this.getPool(lodLevel);
        
        if (targetPool.length < MAX_POOL_SIZE) {
            targetPool.push(grassPatch);
        } else {
            grassPatch.dispose();
        }
    }

    public dispose(): void {
        this.poolHigh.forEach(grassPatch => grassPatch.dispose());
        this.poolMedium.forEach(grassPatch => grassPatch.dispose());
        this.poolLow.forEach(grassPatch => grassPatch.dispose());

        this.poolHigh = [];
        this.poolMedium = [];
        this.poolLow = [];
    }
}

export default new GrassPool();