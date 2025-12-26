import type { InstancedAttributeData } from "@src/types/rendering"; 

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

export interface GenerationConfig {
    totalBlades: number;
    sideLength: number;
    bladesPerRow: number;
    gridSpacing: number;
}

export interface BladeData {
    bladeIndex: number;
    gridX: number;
    gridZ: number; 
    sideLength: number;
    gridSpacing: number;
}