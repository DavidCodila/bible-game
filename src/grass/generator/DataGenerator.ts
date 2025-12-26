import type { BladeData, GenerationConfig } from "../types";
import type { AttributeBuffer, InstancedAttributeData } from "../../types/rendering";
import { BladeAttributeFactory } from "./BladeAttributeFactory";
import * as GrassConstants from "./GrassConstants"
import { GrassAttributeAccessor } from "./GrassAttributeAccessor";

export class DataGenerator {
    public static generateAttributes(config: GenerationConfig): InstancedAttributeData {
        const attributeData = this.allocateBuffers(config.totalBlades);
        const accessor = new GrassAttributeAccessor(attributeData);

        for (let xIndex = 0; xIndex < config.bladesPerRow; xIndex++) {
            for (let zIndex = 0; zIndex < config.bladesPerRow; zIndex++) {
                const bladeIndex = xIndex * config.bladesPerRow + zIndex;
                const bladeData : BladeData = {
                    bladeIndex: bladeIndex, 
                    gridX: xIndex, 
                    gridZ: zIndex,
                    sideLength: config.sideLength,
                    gridSpacing: config.gridSpacing
                }
                BladeAttributeFactory.calculateBlade(bladeData, accessor);
            }
        }
        return attributeData;
    }

    private static allocateBuffers(totalBlades: number): InstancedAttributeData {
        const bufferCollection: AttributeBuffer[] = [];

        GrassConstants.GRASS_BUFFER_LAYOUT.forEach((schema) => {
            bufferCollection[schema.index] = {
                name: schema.name,
                itemSize: schema.itemSize,
                storage: new Float32Array(totalBlades * schema.itemSize)
            };
        });

        return { attributeList: bufferCollection };
    }
}