import { GrassPatch } from './patch/GrassPatch';
import type { GrassBladeConfig } from './types';

const defaultGrassBladeConfig : GrassBladeConfig = {
    bladeHeight: 0.4, bladeWidth: 0.05, segmentsPerBlade: 6
}

export const defaultGrassPatch = () => new GrassPatch({
    sideLength : 10, bladesPerRow: 150, grassBladeConfig: defaultGrassBladeConfig
});
