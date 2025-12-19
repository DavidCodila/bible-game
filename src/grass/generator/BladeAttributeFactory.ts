import type { GenerationConfig } from "../types";
import type { InstancedAttributeData } from "../../types/rendering";

export class BladeAttributeFactory {
    public static calculateBlade(
        bladeIndex: number, 
        gridX: number, 
        gridZ: number, 
        attributeData: InstancedAttributeData, 
        config: GenerationConfig
    ): void {
        const instanceOffsets = attributeData.attributes[0].data;
        const instanceColors = attributeData.attributes[1].data;
        const instanceYAxisRotation = attributeData.attributes[2].data;
        const instanceYAxisScale = attributeData.attributes[3].data;
        const instanceBendX = attributeData.attributes[4].data;
        const instanceBendZ = attributeData.attributes[5].data;

        const jitterBuffer = 0.8;
        const halfSideLength = config.sideLength / 2;

        // Position
        instanceOffsets[bladeIndex * 3] = (gridX * config.gridSpacing) - halfSideLength + (Math.random() - 0.5) * config.gridSpacing * jitterBuffer;
        instanceOffsets[bladeIndex * 3 + 1] = 0; 
        instanceOffsets[bladeIndex * 3 + 2] = (gridZ * config.gridSpacing) - halfSideLength + (Math.random() - 0.5) * config.gridSpacing * jitterBuffer;

        // Rotation
        instanceYAxisRotation[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);

        // Scale
        instanceYAxisScale[bladeIndex] = 0.7 + Math.random() * 1.2;

        // Color - EXACT RESTORATION
        const greenChannel = 0.25 + Math.random() * 0.35;
        const redChannel = 0.08 + Math.random() * 0.08; 
        const blueChannel = 0.03 + Math.random() * 0.05;

        instanceColors[bladeIndex * 3] = redChannel;
        instanceColors[bladeIndex * 3 + 1] = greenChannel;
        instanceColors[bladeIndex * 3 + 2] = blueChannel;

        // Planar Bends
        const leanMagnitude = 0.02 + Math.random() * 0.11;
        const leanDirection = (Math.random() - 0.5) * (Math.PI / 3);
        instanceBendX[bladeIndex] = leanMagnitude * Math.sin(leanDirection);
        instanceBendZ[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    }
}