import type { BladeData, GrassPatchConfig } from "../types";
import type { InstancedAttributeData } from "../../types/rendering";
import { BladeAttributeFactory } from "./BladeAttributeFactory";
import { BufferAllocator } from "./BufferAllocator";

export class DataGenerator {
    public static generateAttributes(config: GrassPatchConfig): InstancedAttributeData {
        const totalBlades = config.bladesPerRow * config.bladesPerRow;
        const gridSpacing = config.sideLength / config.bladesPerRow;
        const attributeData : InstancedAttributeData = BufferAllocator.allocateBuffers(totalBlades);

        for (let xIndex = 0; xIndex < config.bladesPerRow; xIndex++) {
            for (let zIndex = 0; zIndex < config.bladesPerRow; zIndex++) {
                const bladeIndex = xIndex * config.bladesPerRow + zIndex;
                const bladeData : BladeData = {
                    bladeIndex: bladeIndex, 
                    gridX: xIndex, 
                    gridZ: zIndex,
                    sideLength: config.sideLength,
                    gridSpacing: gridSpacing
                }
                BladeAttributeFactory.calculateBlade(bladeData, attributeData.accessor);
            }
        }
        return attributeData;
    }
}