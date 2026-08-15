import type { GrassAppearanceConfig } from './generator/AppearanceConfig';

export interface GrassPatchConfig {
    sideLength: number;
    bladesPerRow: number;
    grassBladeConfig: GrassBladeConfig;
    appearance?: GrassAppearanceConfig;
    densityFilter?: (worldX: number, worldZ: number) => number;
}

export interface GrassBladeConfig {
    bladeHeight: number;
    bladeWidth: number;
    segmentsPerBlade: number;
}

export interface BladeData {
    bladeIndex: number;
    gridX: number;
    gridZ: number;
    sideLength: number;
    gridSpacing: number;
}