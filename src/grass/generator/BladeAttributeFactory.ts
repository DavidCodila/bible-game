import type { BladeData } from "../types";
import { GrassAttributeAccessor } from "./GrassAttributeAccessor";
import { JITTER_BUFFER, VECTOR_OFFSETS, COLOR_INDICES } from "./GrassConstants";
import { DEFAULT_GRASS_APPEARANCE, type GrassAppearanceConfig } from "./AppearanceConfig";

export class BladeAttributeFactory {
    /**
     * Calculates all attributes for a single grass blade instance.
     * 
     * @param bladeData - Grid position and spacing information
     * @param accessor - Type-safe access to Float32Array buffers
     * @param appearance - Visual appearance configuration (rotation, scale, color, lean)
     * 
     * Memory layout:
     * - vec3 attributes (offsets, colors): bladeIndex * 3 + [0,1,2] for [X,Y,Z] or [R,G,B]
     * - scalar attributes (rotation, scale, bend): bladeIndex directly
     */
    public static calculateBlade(
        bladeData: BladeData,
        accessor: GrassAttributeAccessor,
        appearance: GrassAppearanceConfig = DEFAULT_GRASS_APPEARANCE
    ): void {
        const halfSideLength = bladeData.sideLength / 2;
        const bladeIndex = bladeData.bladeIndex;
        const baseIndex = bladeIndex * VECTOR_OFFSETS.ARRAY_3D_OFFSET;

        // ============================================================
        // POSITION (XYZ offset from patch center)
        // ============================================================
        // Formula: gridPosition - patchCenterOffset + jitter
        // Jitter: ±(gridSpacing * JITTER_BUFFER / 2) for natural randomness
        accessor.offsets[baseIndex + VECTOR_OFFSETS.X_OFFSET] = 
            (bladeData.gridX * bladeData.gridSpacing) - halfSideLength + 
            (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;
        
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Y_OFFSET] = 
            0; // Ground level (will add terrain elevation later)
        
        accessor.offsets[baseIndex + VECTOR_OFFSETS.Z_OFFSET] = 
            (bladeData.gridZ * bladeData.gridSpacing) - halfSideLength + 
            (Math.random() - 0.5) * bladeData.gridSpacing * JITTER_BUFFER;

        // ============================================================
        // ROTATION (Y-axis, vertical spin)
        // ============================================================
        // Range: ±(appearance.rotationRange / 2)
        // Example: rotationRange = π/2 → ±π/4 (±45°)
        // Why: Prevents all blades facing same direction (looks planted, not natural)
        accessor.yAxisRotation[bladeIndex] = 
            (Math.random() - 0.5) * appearance.rotationRange;

        // ============================================================
        // SCALE (Y-axis, height variation)
        // ============================================================
        // Formula: minimum + random(0-1) * range
        // Example: 0.7 + random * 1.2 → [0.7, 1.9] = 70%-190% of base height
        // Applied in shader: transformedPosition.y *= instanceScaleY
        accessor.yAxisScale[bladeIndex] = 
            appearance.scaleMinimum + Math.random() * appearance.scaleRange;

        // ============================================================
        // COLOR (RGB channels)
        // ============================================================
        // Each channel: minimum + random(0-1) * range
        // GPU shader multiplies base blade color by these instance colors
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

        // ============================================================
        // LEAN (XZ bend, simulates wind/growth direction)
        // ============================================================
        // Magnitude: How far blade tips lean (0.02-0.13 range)
        // Direction: Angle in XZ plane (±appearance.leanDirectionRange / 2)
        // Applied in shader: bendBias grows quadratically with height (tips bend more)
        const leanMagnitude = 
            appearance.leanMagnitudeMinimum + 
            Math.random() * appearance.leanMagnitudeRange;
        
        const leanDirection = 
            (Math.random() - 0.5) * appearance.leanDirectionRange;

        // Decompose polar lean into X and Z components
        // X-axis bend: leanMagnitude * sin(angle)
        // Z-axis bend: leanMagnitude * cos(angle)
        accessor.bendXAxis[bladeIndex] = leanMagnitude * Math.sin(leanDirection);
        accessor.bendZAxis[bladeIndex] = leanMagnitude * Math.cos(leanDirection);
    }
}