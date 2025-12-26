import { BladeAttributeFactory } from '@src/grass/generator/BladeAttributeFactory';
import { 
    ARRAY_3D_OFFSET, 
    X_OFFSET, 
    Y_OFFSET, 
    Z_OFFSET, 
    RED_INDEX, 
    GREEN_INDEX, 
    BLUE_INDEX,
    JITTER_BUFFER
} from '@src/grass/generator/GrassConstants';
import type { BladeData } from '@src/grass/types';

const TOTAL_BLADES_FOR_TEST = 10;

describe('BladeAttributeFactory', () => {
    let mockAccessor: any;
    const simpleBladeData: BladeData = {
            bladeIndex: 0,
            gridX: 0,
            gridZ: 0,
            gridSpacing: 1,
            sideLength: 10
        };

    beforeEach(() => {
        mockAccessor = {
            offsets: new Float32Array(TOTAL_BLADES_FOR_TEST * ARRAY_3D_OFFSET),
            colors: new Float32Array(TOTAL_BLADES_FOR_TEST * ARRAY_3D_OFFSET),
            yAxisRotation: new Float32Array(TOTAL_BLADES_FOR_TEST),
            yAxisScale: new Float32Array(TOTAL_BLADES_FOR_TEST),
            bendXAxis: new Float32Array(TOTAL_BLADES_FOR_TEST),
            bendZAxis: new Float32Array(TOTAL_BLADES_FOR_TEST),
        };
    });

    it('should calculate blade positions within the expected grid and jitter boundaries', () => {
        const bladeIndex = 0;
        const gridX = 5;
        const gridZ = 3;
        const gridSpacing = 2;
        const sideLength = 10;
        const baseIndex = bladeIndex * ARRAY_3D_OFFSET;
        const bladeData : BladeData = {
            bladeIndex,
            gridX,
            gridZ,
            sideLength,
            gridSpacing,
        }

        BladeAttributeFactory.calculateBlade(bladeData, mockAccessor);

        const xValue = mockAccessor.offsets[baseIndex + X_OFFSET];
        const expectedXBase = (gridX * gridSpacing) - (sideLength / 2);

        const zValue = mockAccessor.offsets[baseIndex + Z_OFFSET];
        const expectedZBase = (gridZ * gridSpacing) - (sideLength / 2);

        const maxDeviation = (0.5 * gridSpacing * JITTER_BUFFER);

        expect(xValue).toBeGreaterThanOrEqual(expectedXBase - maxDeviation);
        expect(xValue).toBeLessThanOrEqual(expectedXBase + maxDeviation);
        
        expect(zValue).toBeGreaterThanOrEqual(expectedZBase - maxDeviation);
        expect(zValue).toBeLessThanOrEqual(expectedZBase + maxDeviation);

        expect(mockAccessor.offsets[baseIndex + Y_OFFSET]).toBe(0); //need to change when adding ground elevation
    });

    it('should generate RGB colors within the legal 0.0 to 1.0 range', () => {
        const baseIndex = simpleBladeData.bladeIndex * ARRAY_3D_OFFSET;
        const channels = [RED_INDEX, GREEN_INDEX, BLUE_INDEX];

        BladeAttributeFactory.calculateBlade(simpleBladeData, mockAccessor);

        channels.forEach(channel => {
            const value = mockAccessor.colors[baseIndex + channel];
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1.0);
        });
    });

    it('should write to the correct memory stride for scalar attributes', () => {
        BladeAttributeFactory.calculateBlade(simpleBladeData, mockAccessor);

        const bladeIndex = simpleBladeData.bladeIndex;
        expect(mockAccessor.yAxisScale[bladeIndex]).toBeGreaterThan(0);
        expect(mockAccessor.yAxisRotation[bladeIndex]).toBeDefined();
    });
});