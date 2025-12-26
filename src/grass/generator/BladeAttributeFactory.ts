import type { BladeData } from "../types";
import { GrassAttributeAccessor } from "./GrassAttributeAccessor";
import { JITTER_BUFFER, 
    VECTOR_OFFSETS, 
    COLOR_INDICES
} from "./GrassConstants";

export class BladeAttributeFactory {
    public static calculateBlade(
        bladeData : BladeData,
        accessor : GrassAttributeAccessor
    ): void {        
        const halfSideLength = bladeData.sideLength / 2;
        const bladeIndex = bladeData.bladeIndex;
        const baseIndex = bladeIndex * VECTOR_OFFSETS.ARRAY_3D_OFFSET;

        accessor.offsets[baseIndex + VECTOR_OFFSETS.X_OFFSET] = 
            (bladeData.gridX * bladeData.gridSpacing) - halfSideLength + (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Y_OFFSET] = 
            0; 
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Z_OFFSET] = 
            (bladeData.gridZ * bladeData.gridSpacing) - halfSideLength + (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;

        accessor.yAxisRotation[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);
        accessor.yAxisScale[bladeIndex] = 0.7 + Math.random() * 1.2;

        const greenChannel = 0.25 + Math.random() * 0.35;
        const redChannel = 0.08 + Math.random() * 0.08; 
        const blueChannel = 0.03 + Math.random() * 0.05;

        // Brighter grass const greenChannel = 0.30 + Math.random() * 0.40; const redChannel = 0.10 + Math.random() * 0.15; const blueChannel = 0.05 + Math.random() * 0.10;
        accessor.colors[baseIndex + COLOR_INDICES.RED] = redChannel;
        accessor.colors[baseIndex + COLOR_INDICES.GREEN] = greenChannel;
        accessor.colors[baseIndex + COLOR_INDICES.BLUE] = blueChannel;

        const leanMagnitude = 0.02 + Math.random() * 0.11;
        const leanDirection = (Math.random() - 0.5) * (Math.PI / 3);
        accessor.bendXAxis[bladeIndex] = leanMagnitude * Math.sin(leanDirection);
        accessor.bendZAxis[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    }
}