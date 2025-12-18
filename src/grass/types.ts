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

export interface GrassAttributeData {
    instanceOffsets: Float32Array;
    instanceColors: Float32Array;
    instanceYAxisRotations: Float32Array;
    instanceYAxisScales: Float32Array;
    instancePlanarBendsX: Float32Array;
    instancePlanarBendsZ: Float32Array;
}
export interface GenerationConfig {
    totalBlades: number;
    sideLength: number;
    bladesPerRow: number;
    gridSpacing: number;
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