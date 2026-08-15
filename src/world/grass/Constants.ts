import { BRIGHT_GRASS_APPEARANCE } from './generator/AppearanceConfig';
import type { GrassBladeConfig } from './types';
import { GrassPatch } from './patch/GrassPatch';
import { WORLD_SIZE_METERS } from '../WorldConfig';
import type { WindService } from '../wind/WindService';

export const LOOP_TIME_IN_RADIANS = 20 * Math.PI;

export const defaultGrassBladeConfig: GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.08, segmentsPerBlade: 3
};

export const GRASS_GRID_CONFIG = {
    patchSize: WORLD_SIZE_METERS,       // The width/depth of one patch
    patchesPerSide: WORLD_SIZE_METERS,         // Number of patches per side (2x2 = 4 patches)
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE,
};


export const brightGrassPatch = (windService: WindService) => new GrassPatch({
    sideLength: WORLD_SIZE_METERS,
    bladesPerRow: 250,                    // this is now the MAX density (centre)
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE,

    // ← SMOOTH TAPER
    densityFilter: (worldX: number, worldZ: number) => {
        const distFromCenter = Math.hypot(worldX, worldZ);
        const halfWorld = WORLD_SIZE_METERS / 2;   // 12.5 m

        // Linear taper: 100% at centre → exactly 50% at the edge
        return 1.0 - (distFromCenter / halfWorld) * 0.5;
    }
}, windService);
