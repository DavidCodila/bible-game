import type { LODThresholds, LODDensities } from "./types";

export const DEFAULT_LOD_THRESHOLDS: LODThresholds = {
    highToMedium: 11.0, 
    mediumToHigh: 8.0, 
    mediumToLow: 20.0,
    lowToMedium: 23.0
};

export const DEFAULT_LOD_DENSITIES: LODDensities = {
    high: 12,
    medium: 8,
    low: 5
};