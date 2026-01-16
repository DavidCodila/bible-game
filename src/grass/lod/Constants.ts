import type { LODThresholds, LODDensities } from "./model/types";

export const PATCHES_PER_POOL: number = 50;
export const MAX_POOL_SIZE: number = 100;
export const BEHIND_CAMERA_THRESHOLD_BUFFER = -1.0;

export const DEFAULT_LOD_THRESHOLDS: LODThresholds = {
    highToMedium: 11.0, 
    mediumToHigh: 14.0, 
    mediumToLow: 29.0,
    lowToMedium: 26.0
};

export const DEFAULT_LOD_DENSITIES: LODDensities = {
    high: 7,
    medium: 4,
    low: 2
};