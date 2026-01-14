import { GrassPatch } from './patch/GrassPatch';
import { DARK_GRASS_APPEARANCE, BRIGHT_GRASS_APPEARANCE } from './generator/AppearanceConfig';
import type { GrassBladeConfig } from './types';
import type { LODConfig } from './lod/types';
import { DEFAULT_LOD_DENSITIES, DEFAULT_LOD_THRESHOLDS } from './lod/Constants';

export const defaultGrassBladeConfig: GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 3
};

export const defaultGrassPatch = () => new GrassPatch({
    sideLength: 10,
    bladesPerRow: 150,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: DARK_GRASS_APPEARANCE
});

export const smallGrassPatch = () => new GrassPatch({
    sideLength: 1,
    bladesPerRow: 15,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: DARK_GRASS_APPEARANCE
});

export const brightGrassPatch = () => new GrassPatch({
    sideLength: 1,
    bladesPerRow: 15,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE
});

export const LOOP_TIME_IN_RADIANS = 20 * Math.PI;

export const GRASS_GRID_CONFIG : LODConfig = {
    patchSize: 0.8,       // The width/depth of one patch
    patchesPerSide: 20,         // Number of patches per side (2x2 = 4 patches)
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE,
    lodThresholds: DEFAULT_LOD_THRESHOLDS,
    lodDensities: DEFAULT_LOD_DENSITIES
};