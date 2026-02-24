import { BRIGHT_GRASS_APPEARANCE } from './generator/AppearanceConfig';
import type { GrassBladeConfig } from './types';
import { GrassPatch } from './patch/GrassPatch';
import { WORLD_SIZE_METERS } from '../WorldConfig';
import type { WindService } from '../wind/WindService';

export const LOOP_TIME_IN_RADIANS = 20 * Math.PI;

export const defaultGrassBladeConfig: GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.08, segmentsPerBlade: 6
};

export const GRASS_GRID_CONFIG = {
    patchSize: 1,       // The width/depth of one patch
    patchesPerSide: WORLD_SIZE_METERS,         // Number of patches per side (2x2 = 4 patches)
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE,
};


export const brightGrassPatch = (windService: WindService) => new GrassPatch({
    sideLength: 1,
    bladesPerRow: 10,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE
}, windService);
