import type { GrassAppearanceConfig } from "../../generator/AppearanceConfig";
import type { GrassPatch } from "../../patch/GrassPatch";
import type { GrassBladeConfig } from "../../types";
import type { GrassLODPatch } from "./GrassLODPatch";

export type LODLevel = 'high' | 'medium' | 'low';

export interface LODThresholds {
    highToMedium: number;
    mediumToHigh: number;
    mediumToLow: number;
    lowToMedium: number;
}

export interface LODDensities {
    high: number;
    medium: number;
    low: number;
}

export interface LODConfig {
    patchSize: number;
    patchesPerSide: number;
    grassBladeConfig: GrassBladeConfig;
    appearance: GrassAppearanceConfig;
    lodThresholds: LODThresholds;
    lodDensities: LODDensities;
}

export interface Transition {
    outgoing: GrassPatch;
    incoming: GrassPatch;
    outgoingLevel: LODLevel;
    targetLevel: LODLevel;
    lodPatchRef: GrassLODPatch;
    progress: number;
}