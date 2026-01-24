import type { BladeData, GrassPatchConfig } from "../types";
import type { InstancedAttributeData } from "../../../types/rendering";
import { BladeAttributeFactory } from "./BladeAttributeFactory";
import { BufferAllocator } from "./BufferAllocator";
import { DEFAULT_GRASS_APPEARANCE } from "./AppearanceConfig";

export class DataGenerator {
    public static generateAttributes(config: GrassPatchConfig): InstancedAttributeData {
        const totalBlades = config.bladesPerRow * config.bladesPerRow;
        const gridSpacing = config.sideLength / config.bladesPerRow;
        const attributeData: InstancedAttributeData = BufferAllocator.allocateBuffers(totalBlades);

        const bladeData: BladeData = { 
            bladeIndex: 0, gridX: 0, gridZ: 0, sideLength: config.sideLength, gridSpacing: gridSpacing 
        };

        for (let xIndex = 0; xIndex < config.bladesPerRow; xIndex++) {
            for (let zIndex = 0; zIndex < config.bladesPerRow; zIndex++) {
                bladeData.bladeIndex = xIndex * config.bladesPerRow + zIndex;
                bladeData.gridX = xIndex;
                bladeData.gridZ = zIndex;
                
                BladeAttributeFactory.calculateBlade(
                    bladeData, 
                    attributeData.accessor, 
                    config.appearance ?? DEFAULT_GRASS_APPEARANCE
                );
            }
        }
        return attributeData;
    }
}