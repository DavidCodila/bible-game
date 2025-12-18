import type { GenerationConfig, GrassAttributeData } from "./types";

export class GrassDataGenerator {

    /**
     * Generates all randomized per-instance attributes (position, color, scale, bend).
     */
    public static generateAttributes(config: GenerationConfig): GrassAttributeData {
        
        // --- 1. ATTRIBUTE ARRAY ALLOCATION ---
        const instanceOffsets = new Float32Array(config.totalBlades * 3);
        const instanceColors = new Float32Array(config.totalBlades * 3);
        const instanceYAxisRotations = new Float32Array(config.totalBlades);
        const instanceYAxisScales = new Float32Array(config.totalBlades);
        const instancePlanarBendsX = new Float32Array(config.totalBlades); 
        const instancePlanarBendsZ = new Float32Array(config.totalBlades);
        const bladeSpacingBuffer = 0.8;
        
        // --- 2. THE MAIN ATTRIBUTE FILLING LOOP (UNIFORM JITTER) ---
        for (let xIndex = 0; xIndex < config.bladesPerRow; xIndex++) { 
            for (let zIndex = 0; zIndex < config.bladesPerRow; zIndex++) {
                const bladeIndex = xIndex * config.bladesPerRow + zIndex;
                
                // Base pos + Uniform Jitter (no clumping)
                const xPosition = xIndex * config.gridSpacing - config.sideLength / 2 
                    + (Math.random() - 0.5) * config.gridSpacing * bladeSpacingBuffer;                           
                const zPosition = zIndex * config.gridSpacing - config.sideLength / 2 
                    + (Math.random() - 0.5) * config.gridSpacing * bladeSpacingBuffer;                           

                // Offsets (X, Y, Z position)
                instanceOffsets[bladeIndex * 3 + 0] = xPosition;
                instanceOffsets[bladeIndex * 3 + 1] = 0;
                instanceOffsets[bladeIndex * 3 + 2] = zPosition;

                // Y Axis Rotation and Scale
                instanceYAxisRotations[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);
                instanceYAxisScales[bladeIndex] = 0.7 + Math.random() * 1.2;

                // Bending (X and Z components)
                const leanMagnitude = 0.02 + Math.random() * 0.11;
                const leanDirection = (Math.random() - 0.5) * Math.PI / 3; 
                instancePlanarBendsX[bladeIndex] = leanMagnitude * Math.sin(leanDirection); 
                instancePlanarBendsZ[bladeIndex] = leanMagnitude * Math.cos(leanDirection);

                // Color Variation (Subtle greens)
                const greenChannel = 0.25 + Math.random() * 0.35;
                const redChannel = 0.08 + Math.random() * 0.08; 
                const blueChannel = 0.03 + Math.random() * 0.05;
                instanceColors[bladeIndex * 3 + 0] = redChannel;
                instanceColors[bladeIndex * 3 + 1] = greenChannel;
                instanceColors[bladeIndex * 3 + 2] = blueChannel;
            }
        }
        
        return {
            instanceOffsets,
            instanceColors,
            instanceYAxisRotations,
            instanceYAxisScales,
            instancePlanarBendsX,
            instancePlanarBendsZ,
        };
    }
}