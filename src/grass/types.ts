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

export interface AODensityConfig {
    grassPatchSideLength: number;
    maximumNeighborDistance: number;
    densityRequiredForMaxAO: number;
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface GridIndexes {
    row: number;
    column: number;
}