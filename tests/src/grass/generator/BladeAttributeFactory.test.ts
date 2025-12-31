// @vitest-environment node
import { BladeAttributeFactory } from '@src/grass/generator/BladeAttributeFactory';
import { 
    VECTOR_OFFSETS, 
    COLOR_INDICES,
    JITTER_BUFFER
} from '@src/grass/generator/GrassConstants';
import type { BladeData } from '@src/grass/types';

const TOTAL_BLADES_FOR_TEST = 10;

describe('BladeAttributeFactory', () => {
    let mockAccessor: {
        offsets: Float32Array;
        colors: Float32Array;
        yAxisRotation: Float32Array;
        yAxisScale: Float32Array;
        bendXAxis: Float32Array;
        bendZAxis: Float32Array;
    };
    const simpleBladeData: BladeData = {
            bladeIndex: 0,
            gridX: 0,
            gridZ: 0,
            gridSpacing: 1,
            sideLength: 10
        };

    beforeEach(() => {
        mockAccessor = {
            offsets: new Float32Array(TOTAL_BLADES_FOR_TEST * VECTOR_OFFSETS.ARRAY_3D_OFFSET),
            colors: new Float32Array(TOTAL_BLADES_FOR_TEST * VECTOR_OFFSETS.ARRAY_3D_OFFSET),
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
        const baseIndex = bladeIndex * VECTOR_OFFSETS.ARRAY_3D_OFFSET;
        const bladeData : BladeData = {
            bladeIndex,
            gridX,
            gridZ,
            sideLength,
            gridSpacing,
        }

        BladeAttributeFactory.calculateBlade(bladeData, mockAccessor);

        const xValue = mockAccessor.offsets[baseIndex + VECTOR_OFFSETS.X_OFFSET];
        const expectedXBase = (gridX * gridSpacing) - (sideLength / 2);

        const zValue = mockAccessor.offsets[baseIndex + VECTOR_OFFSETS.Z_OFFSET];
        const expectedZBase = (gridZ * gridSpacing) - (sideLength / 2);

        const maxDeviation = (0.5 * gridSpacing * JITTER_BUFFER);

        expect(xValue).toBeGreaterThanOrEqual(expectedXBase - maxDeviation);
        expect(xValue).toBeLessThanOrEqual(expectedXBase + maxDeviation);
        
        expect(zValue).toBeGreaterThanOrEqual(expectedZBase - maxDeviation);
        expect(zValue).toBeLessThanOrEqual(expectedZBase + maxDeviation);

        expect(mockAccessor.offsets[baseIndex + VECTOR_OFFSETS.Y_OFFSET]).toBe(0); //need to change when adding ground elevation
    });

    it('should generate RGB colors within the legal 0.0 to 1.0 range', () => {
        const baseIndex = simpleBladeData.bladeIndex * VECTOR_OFFSETS.ARRAY_3D_OFFSET;

        BladeAttributeFactory.calculateBlade(simpleBladeData, mockAccessor);

        const red = mockAccessor.colors[baseIndex + COLOR_INDICES.RED];
        const green = mockAccessor.colors[baseIndex + COLOR_INDICES.GREEN];
        const blue = mockAccessor.colors[baseIndex + COLOR_INDICES.BLUE];

        expect(red).toBeGreaterThanOrEqual(0);
        expect(red).toBeLessThanOrEqual(1.0);
        
        expect(green).toBeGreaterThanOrEqual(0);
        expect(green).toBeLessThanOrEqual(1.0);

        expect(blue).toBeGreaterThanOrEqual(0);
        expect(blue).toBeLessThanOrEqual(1.0);
    });

    it('should write scalar attributes to the correct memory index', () => {
        BladeAttributeFactory.calculateBlade(simpleBladeData, mockAccessor);

        const bladeIndex = simpleBladeData.bladeIndex;

        expect(mockAccessor.yAxisScale[bladeIndex]).toBeGreaterThan(0);

        const rotation = mockAccessor.yAxisRotation[bladeIndex];
        expect(rotation).toBeGreaterThanOrEqual(-Math.PI/2);
        expect(rotation).toBeLessThanOrEqual(Math.PI/2);

        expect(mockAccessor.bendXAxis[bladeIndex]).toStrictEqual(expect.any(Number));
        expect(mockAccessor.bendZAxis[bladeIndex]).toStrictEqual(expect.any(Number));
    });

    it('should always stay within bounds over many iterations', () => {
        for (let i = 0; i < 100; i++) {
            BladeAttributeFactory.calculateBlade(simpleBladeData, mockAccessor);
            const rotation = mockAccessor.yAxisRotation[simpleBladeData.bladeIndex];
            expect(rotation).toBeGreaterThanOrEqual(-Math.PI/2);
            expect(rotation).toBeLessThanOrEqual(Math.PI/2);
        }
    });
});