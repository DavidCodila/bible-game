// @vitest-environment node
import { BladeAttributeFactory } from '@src/grass/generator/BladeAttributeFactory';
import * as AppearanceModule from '@src/grass/generator/AppearanceConfig';
import { VECTOR_OFFSETS, COLOR_INDICES, JITTER_BUFFER } from '@src/grass/generator/GrassConstants';
import type { GrassAppearanceConfig } from '@src/grass/generator/AppearanceConfig';

describe('BladeAttributeFactory', () => {
    const createMockAccessor = () => ({
        offsets: new Float32Array(3),
        colors: new Float32Array(3),
        yAxisRotation: new Float32Array(1),
        yAxisScale: new Float32Array(1),
        bendXAxis: new Float32Array(1),
        bendZAxis: new Float32Array(1),
    });

    const mockBladeData = {
        bladeIndex: 0,
        gridX: 1,
        gridZ: 1,
        gridSpacing: 1,
        sideLength: 10
    };

    it('should pull values from DEFAULT_GRASS_APPEARANCE and process them correctly', () => {
        const randomNumber = 0.5;
        const accessor = createMockAccessor();
        
        const mockDefault: GrassAppearanceConfig = {
            ...AppearanceModule.DARK_GRASS_APPEARANCE,
        };
        
        // We spy on the 'get' trap because DEFAULT_GRASS_APPEARANCE is a constant export
        const spy = vi.spyOn(AppearanceModule, 'DEFAULT_GRASS_APPEARANCE', 'get').mockReturnValue(mockDefault);
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(randomNumber);
    
        BladeAttributeFactory.calculateBlade(mockBladeData, accessor);
    
        // 1. Verify the Math follows the Formula exactly
        const expectedScale = mockDefault.scaleMinimum + (randomNumber * mockDefault.scaleRange);
        expect(accessor.yAxisScale[0]).toBeCloseTo(expectedScale);
    
        // 2. Verify the Dependency Access
        // This proves the method actually accessed the DEFAULT_GRASS_APPEARANCE property
        expect(spy).toHaveBeenCalled();
    
        randomSpy.mockRestore();
        spy.mockRestore();
    });

    it('should map all configuration properties to the correct buffer indices using internal math formulas', () => {
        const accessor = createMockAccessor();
        const randomNumber = 0.75;
        
        const config: GrassAppearanceConfig = {
            rotationRange: Math.PI / 2, 
            scaleMinimum: 1.2,
            scaleRange: 0.5,
            leanMagnitudeMinimum: 0.4,
            leanMagnitudeRange: 0.2,
            leanDirectionRange: Math.PI,
            colorRanges: {
                red:   { minimum: 0.1, range: 0.1 },
                green: { minimum: 0.2, range: 0.2 },
                blue:  { minimum: 0.3, range: 0.3 }
            }
        };
    
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(randomNumber);
        
        BladeAttributeFactory.calculateBlade(mockBladeData, accessor, config);
    
        const expectedScale = config.scaleMinimum + (randomNumber * config.scaleRange);
        expect(accessor.yAxisScale[0]).toBeCloseTo(expectedScale);
    
        // 2. Validate Rotation Math: (rand - 0.5) * range
        const expectedRotation = (randomNumber - 0.5) * config.rotationRange;
        expect(accessor.yAxisRotation[0]).toBeCloseTo(expectedRotation);
    
        // 3. Validate Color Math: min + (rand * range) for each channel
        const expectedRed = config.colorRanges.red.minimum + (randomNumber * config.colorRanges.red.range);
        const expectedGreen = config.colorRanges.green.minimum + (randomNumber * config.colorRanges.green.range);
        const expectedBlue = config.colorRanges.blue.minimum + (randomNumber * config.colorRanges.blue.range);
    
        expect(accessor.colors[COLOR_INDICES.RED]).toBeCloseTo(expectedRed);
        expect(accessor.colors[COLOR_INDICES.GREEN]).toBeCloseTo(expectedGreen);
        expect(accessor.colors[COLOR_INDICES.BLUE]).toBeCloseTo(expectedBlue);
    
        // 4. Validate Lean Trig: magnitude * sin/cos(direction)
        const leanMagnitude = config.leanMagnitudeMinimum + (randomNumber * config.leanMagnitudeRange);
        const leanDirection = (randomNumber - 0.5) * config.leanDirectionRange;
        
        const expectedLeanX = leanMagnitude * Math.sin(leanDirection);
        const expectedLeanZ = leanMagnitude * Math.cos(leanDirection);
    
        expect(accessor.bendXAxis[0]).toBeCloseTo(expectedLeanX);
        expect(accessor.bendZAxis[0]).toBeCloseTo(expectedLeanZ);
    
        // 5. Validate Position (including Jitter Buffer)
        // Formula: (grid * spacing) - halfSideLength + (rand - 0.5) * spacing * JITTER_BUFFER
        const halfSideLength = mockBladeData.sideLength / 2;
        const expectedPosX = (mockBladeData.gridX * mockBladeData.gridSpacing) - 
                             halfSideLength + 
                             (randomNumber - 0.5) * mockBladeData.gridSpacing * JITTER_BUFFER;
        
        expect(accessor.offsets[VECTOR_OFFSETS.X_OFFSET]).toBeCloseTo(expectedPosX);
    
        randomSpy.mockRestore();
    });
});