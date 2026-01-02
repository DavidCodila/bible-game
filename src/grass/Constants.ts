import { GrassPatch } from './patch/GrassPatch';
import { DARK_GRASS_APPEARANCE, BRIGHT_GRASS_APPEARANCE } from './generator/AppearanceConfig';
import type { GrassBladeConfig } from './types';

const defaultGrassBladeConfig: GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 6
};

export const defaultGrassPatch = () => new GrassPatch({
    sideLength: 10,
    bladesPerRow: 150,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: DARK_GRASS_APPEARANCE
});

export const smallGrassPatch = () => new GrassPatch({
    sideLength: 2,
    bladesPerRow: 30,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: DARK_GRASS_APPEARANCE
});

export const brightGrassPatch = () => new GrassPatch({
    sideLength: 10,
    bladesPerRow: 150,
    grassBladeConfig: defaultGrassBladeConfig,
    appearance: BRIGHT_GRASS_APPEARANCE
});