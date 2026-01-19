import { BRIGHT_GRASS_APPEARANCE } from './generator/AppearanceConfig';
import type { GrassBladeConfig } from './types';
import { GrassPatch } from './patch/GrassPatch';

export const LOOP_TIME_IN_RADIANS = 20 * Math.PI;

export const defaultGrassBladeConfig: GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.08, segmentsPerBlade: 3
};

export const GRASS_GRID_CONFIG = {
    patchSize: 2,       // The width/depth of one patch
    patchesPerSide: 20,         // Number of patches per side (2x2 = 4 patches)
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE,
};


export const brightGrassPatch = () => new GrassPatch({
    sideLength: 2,
    bladesPerRow: 10,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE
});

export function createPatch(bladesPerRow: number): GrassPatch {
    return new GrassPatch({
        sideLength: GRASS_GRID_CONFIG.patchSize,
        bladesPerRow: bladesPerRow,
        grassBladeConfig: GRASS_GRID_CONFIG.grassBladeConfig,
        appearance: GRASS_GRID_CONFIG.appearance
    });
}
