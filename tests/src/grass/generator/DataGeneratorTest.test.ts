import { DataGenerator } from '@src/grass/generator/DataGenerator';
import { BladeAttributeFactory } from '@src/grass/generator/BladeAttributeFactory';
import { BufferAllocator } from '@src/grass/generator/BufferAllocator';
import type { GrassPatchConfig } from '@src/grass/types';

describe('DataGenerator', () => {
    const patchConfiguration: GrassPatchConfig = {
        sideLength: 10,
        bladesPerRow: 2, //change "should process blades in the correct Z-major order" test if you change this!
        grassBladeConfig: {
            bladeHeight: 2,
            bladeWidth: 0.1,
            segmentsPerBlade: 5
        }
    };
    const totalBlades = patchConfiguration.bladesPerRow * patchConfiguration.bladesPerRow;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should use BufferAllocator to prepare the data package', () => {
        const allocatorSpy = vi.spyOn(BufferAllocator, 'allocateBuffers');
        
        DataGenerator.generateAttributes(patchConfiguration);

        expect(allocatorSpy).toHaveBeenCalledWith(totalBlades);
    });

    it('should process blades in the correct Z-major order', () => {
        const calculateBladeSpy = vi.spyOn(BladeAttributeFactory, 'calculateBlade');
        const result = DataGenerator.generateAttributes(patchConfiguration);

        const expectedOrderedBladeData = [
            { bladeIndex: 0, gridX: 0, gridZ: 0 },
            { bladeIndex: 1, gridX: 0, gridZ: 1 },
            { bladeIndex: 2, gridX: 1, gridZ: 0 },
            { bladeIndex: 3, gridX: 1, gridZ: 1 }
        ];

        expectedOrderedBladeData.forEach((bladeData, callIndex) => {
            expect(calculateBladeSpy).toHaveBeenNthCalledWith(
                callIndex + 1,
                expect.objectContaining(bladeData),
                result.accessor
            );
        });
    });
});