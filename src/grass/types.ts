export interface GrassPatchConfig {
    sideLength: number;
    bladesPerRow: number;
    grassBladeConfig: GrassBladeConfig
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