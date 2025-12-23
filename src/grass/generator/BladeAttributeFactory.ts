import type { BladeData } from "../types";

export class BladeAttributeFactory {
    public static calculateBlade(
        bladeData : BladeData
    ): void {
        const instanceOffsets = bladeData.attributeData.attributes[0].data;
        const instanceColors = bladeData.attributeData.attributes[1].data;
        const instanceYAxisRotation = bladeData.attributeData.attributes[2].data;
        const instanceYAxisScale = bladeData.attributeData.attributes[3].data;
        const instanceBendX = bladeData.attributeData.attributes[4].data;
        const instanceBendZ = bladeData.attributeData.attributes[5].data;
        const jitterBuffer = 0.8;
        const halfSideLength = bladeData.sideLength / 2;
        const bladeIndex = bladeData.bladeIndex;
        const array3DOffset = 3;
        const xOffset = 0; const yOffset = 1; const zOffset = 2;

        instanceOffsets[bladeIndex * array3DOffset + xOffset] = 
            (bladeData.gridX * bladeData.gridSpacing) - halfSideLength + (Math.random() - 0.5) * bladeData.gridSpacing * jitterBuffer;
        instanceOffsets[bladeIndex * array3DOffset + yOffset] = 
            0; 
        instanceOffsets[bladeIndex * array3DOffset + zOffset] = 
            (bladeData.gridZ * bladeData.gridSpacing) - halfSideLength + (Math.random() - 0.5) * bladeData.gridSpacing * jitterBuffer;

        instanceYAxisRotation[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);
        instanceYAxisScale[bladeIndex] = 0.7 + Math.random() * 1.2;

        const greenChannel = 0.25 + Math.random() * 0.35;
        const redChannel = 0.08 + Math.random() * 0.08; 
        const blueChannel = 0.03 + Math.random() * 0.05;

        // Brighter grass const greenChannel = 0.30 + Math.random() * 0.40; const redChannel = 0.10 + Math.random() * 0.15; const blueChannel = 0.05 + Math.random() * 0.10;
        instanceColors[bladeIndex * array3DOffset] = redChannel;
        instanceColors[bladeIndex * array3DOffset + 1] = greenChannel;
        instanceColors[bladeIndex * array3DOffset + 2] = blueChannel;

        const leanMagnitude = 0.02 + Math.random() * 0.11;
        const leanDirection = (Math.random() - 0.5) * (Math.PI / 3);
        instanceBendX[bladeIndex] = leanMagnitude * Math.sin(leanDirection);
        instanceBendZ[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    }
}