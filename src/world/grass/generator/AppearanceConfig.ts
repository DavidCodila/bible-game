export interface GrassAppearanceConfig {
    rotationRange: number;
    
    scaleMinimum: number;
    scaleRange: number;
    
    leanMagnitudeMinimum: number;
    leanMagnitudeRange: number;
    leanDirectionRange: number;
    
    colorRanges: {
        red: { minimum: number; range: number };
        green: { minimum: number; range: number };
        blue: { minimum: number; range: number };
    };
}

export const DARK_GRASS_APPEARANCE: GrassAppearanceConfig = {
    rotationRange: Math.PI / 2,          // ±45° rotation
    scaleMinimum: 0.7,                   // 70% minimum height
    scaleRange: 1.2,                     // Up to 190% total height
    leanMagnitudeMinimum: 0.02,          // Subtle base lean
    leanMagnitudeRange: 0.11,            // Up to 0.13 total lean
    leanDirectionRange: Math.PI / 3,     // ±30° lean direction
    colorRanges: {
        red:   { minimum: 0.08, range: 0.08 },  // [0.08, 0.16] - Brownish tint
        green: { minimum: 0.25, range: 0.35 },  // [0.25, 0.60] - Deep green
        blue:  { minimum: 0.03, range: 0.05 }   // [0.03, 0.08] - Minimal blue
    }
};

export const BRIGHT_GRASS_APPEARANCE: GrassAppearanceConfig = {
    rotationRange: Math.PI / 2,          // ±45° rotation (same as dark)
    scaleMinimum: 0.7,                   // 70% minimum height (same as dark)
    scaleRange: 1.2,                     // Up to 190% total height (same as dark)
    leanMagnitudeMinimum: 0.02,          // Subtle base lean (same as dark)
    leanMagnitudeRange: 0.11,            // Up to 0.13 total lean (same as dark)
    leanDirectionRange: Math.PI / 3,     // ±30° lean direction (same as dark)
    colorRanges: {
        red:   { minimum: 0.10, range: 0.15 },  // [0.10, 0.25] - Warmer tint
        green: { minimum: 0.30, range: 0.40 },  // [0.30, 0.70] - Brighter green
        blue:  { minimum: 0.05, range: 0.10 }   // [0.05, 0.15] - More blue for vibrancy
    }
};

export const DEFAULT_GRASS_APPEARANCE = DARK_GRASS_APPEARANCE;