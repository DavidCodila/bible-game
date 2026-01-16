import { GRASS_GRID_CONFIG } from '../../Constants';
import type { LODLevel } from '../model/types';

export class LODCalculator {
    private static readonly thresholds = {
        highToMed: GRASS_GRID_CONFIG.lodThresholds.highToMedium ** 2,
        medToHigh: GRASS_GRID_CONFIG.lodThresholds.mediumToHigh ** 2,
        medToLow: GRASS_GRID_CONFIG.lodThresholds.mediumToLow ** 2,
        lowToMed: GRASS_GRID_CONFIG.lodThresholds.lowToMedium ** 2
    };

    public static getTargetLevel(distanceSquared: number, currentLevel: LODLevel): LODLevel {
        if (currentLevel === 'high') {
            return distanceSquared > this.thresholds.highToMed ? 'medium' : 'high';
        }

        if (currentLevel === 'medium') {
            if (distanceSquared < this.thresholds.medToHigh) return 'high';
            if (distanceSquared > this.thresholds.medToLow) return 'low';
            return 'medium';
        }

        return distanceSquared < this.thresholds.lowToMed ? 'medium' : 'low';
    }
}