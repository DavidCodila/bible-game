import type { BladeData } from "../types";
import { GrassAttributeAccessor } from "./GrassAttributeAccessor";
import { JITTER_BUFFER, VECTOR_OFFSETS, COLOR_INDICES } from "./GrassConstants";
import { DEFAULT_GRASS_APPEARANCE, type GrassAppearanceConfig } from "./AppearanceConfig";

export class BladeAttributeFactory {
    public static calculateBlade(
        bladeData: BladeData,
        accessor: GrassAttributeAccessor,
        appearance: GrassAppearanceConfig = DEFAULT_GRASS_APPEARANCE
    ): void {
        const halfSideLength = bladeData.sideLength / 2;
        const bladeIndex = bladeData.bladeIndex;
        const baseIndex = bladeIndex * VECTOR_OFFSETS.ARRAY_3D_OFFSET;

        accessor.offsets[baseIndex + VECTOR_OFFSETS.X_OFFSET] = 
            (bladeData.gridX * bladeData.gridSpacing) - halfSideLength + 
            (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;
        
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Y_OFFSET] = 
            0; // Ground level (will add terrain elevation later)
        
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Z_OFFSET] = 
            (bladeData.gridZ * bladeData.gridSpacing) - halfSideLength + 
            (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;

        accessor.yAxisRotation[bladeIndex] = 
            (Math.random() - 0.5) * appearance.rotationRange;

        accessor.yAxisScale[bladeIndex] = 
            appearance.scaleMinimum + Math.random() * appearance.scaleRange;

        const redChannel = 
            appearance.colorRanges.red.minimum + 
            Math.random() * appearance.colorRanges.red.range;
        
        const greenChannel = 
            appearance.colorRanges.green.minimum + 
            Math.random() * appearance.colorRanges.green.range;
        
        const blueChannel = 
            appearance.colorRanges.blue.minimum + 
            Math.random() * appearance.colorRanges.blue.range;

        accessor.colors[baseIndex + COLOR_INDICES.RED] = redChannel;
        accessor.colors[baseIndex + COLOR_INDICES.GREEN] = greenChannel;
        accessor.colors[baseIndex + COLOR_INDICES.BLUE] = blueChannel;

        const leanMagnitude = 
            appearance.leanMagnitudeMinimum + 
            Math.random() * appearance.leanMagnitudeRange;
        
        const leanDirection = 
            (Math.random() - 0.5) * appearance.leanDirectionRange;

        accessor.bendXAxis[bladeIndex] = leanMagnitude * Math.sin(leanDirection);
        accessor.bendZAxis[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    }
}