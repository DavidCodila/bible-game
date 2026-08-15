import type { BladeData, GrassPatchConfig } from "../types";
import type { InstancedAttributeData } from "../../../types/rendering";
import { BladeAttributeFactory } from "./BladeAttributeFactory";
import { BufferAllocator } from "./BufferAllocator";
import { DEFAULT_GRASS_APPEARANCE } from "./AppearanceConfig";

export class DataGenerator {
    public static generateAttributes(config: GrassPatchConfig): InstancedAttributeData {
        const { bladesPerRow, densityFilter } = config;
        const gridSpacing = config.sideLength / bladesPerRow;

        const attributeData = BufferAllocator.allocateBuffers(bladesPerRow * bladesPerRow);

        let keptCount = 0;

        const bladeData: BladeData = {
            bladeIndex: 0,
            gridX: 0,
            gridZ: 0,
            sideLength: config.sideLength,
            gridSpacing
        };

        for (let xIndex = 0; xIndex < bladesPerRow; xIndex++) {
            for (let zIndex = 0; zIndex < bladesPerRow; zIndex++) {
                const worldX = (xIndex * gridSpacing) - (config.sideLength / 2);
                const worldZ = (zIndex * gridSpacing) - (config.sideLength / 2);

                // === DENSITY TAPER ===
                let keep = true;
                if (densityFilter) {
                    const prob = densityFilter(worldX, worldZ);
                    keep = Math.random() < prob;
                }

                if (!keep) continue;

                bladeData.bladeIndex = keptCount;   // use real index
                bladeData.gridX = xIndex;
                bladeData.gridZ = zIndex;

                BladeAttributeFactory.calculateBlade(
                    bladeData,
                    attributeData.accessor,
                    config.appearance ?? DEFAULT_GRASS_APPEARANCE
                );

                keptCount++;
            }
        }

        console.log(`🌿 Grass: Created ${keptCount} blades (tapered from ${bladesPerRow * bladesPerRow})`);

        return {
            ...attributeData,
            count: keptCount                     // ← this fixes your TS error
        };
    }
}