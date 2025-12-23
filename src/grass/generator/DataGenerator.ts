import type { GenerationConfig } from "../types";
import type { InstancedAttributeData } from "../../types/rendering";
import { BladeAttributeFactory } from "./BladeAttributeFactory";

export class DataGenerator {
    public static generateAttributes(config: GenerationConfig): InstancedAttributeData {
        const attributeData = this.allocateBuffers(config.totalBlades);

        for (let xIndex = 0; xIndex < config.bladesPerRow; xIndex++) {
            for (let zIndex = 0; zIndex < config.bladesPerRow; zIndex++) {
                const bladeIndex = xIndex * config.bladesPerRow + zIndex;
                
                BladeAttributeFactory.calculateBlade({
                    bladeIndex: bladeIndex, 
                    gridX: xIndex, 
                    gridZ: zIndex, 
                    attributeData: attributeData, 
                    sideLength: config.sideLength,
                    gridSpacing: config.gridSpacing
                });
            }
        }
        return attributeData;
    }

    private static allocateBuffers(count: number): InstancedAttributeData {
        return {
            attributes: [
                { name: "instanceOffsets", itemSize: 3, data: new Float32Array(count * 3) },
                { name: "instanceColors", itemSize: 3, data: new Float32Array(count * 3) },
                { name: "instanceYAxisRotation", itemSize: 1, data: new Float32Array(count) },
                { name: "instanceScaleY", itemSize: 1, data: new Float32Array(count) },
                { name: "instanceBendX", itemSize: 1, data: new Float32Array(count) },
                { name: "instanceBendZ", itemSize: 1, data: new Float32Array(count) }
            ]
        };
    }
}