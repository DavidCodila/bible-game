import { BufferAllocator } from "@src/grass/generator/BufferAllocator";
import { GrassAttributeAccessor } from "@src/grass/generator/GrassAttributeAccessor";
import * as GrassConstants from "@src/grass/generator/GrassConstants";

vi.mock("@src/grass/generator/GrassAttributeAccessor");

describe('BufferAllocator', () => {
    const totalBlades = 10;
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should correctly allocate the full attribute list based on the layout', () => {
        const { attributeList } = BufferAllocator.allocateBuffers(totalBlades);

        expect(attributeList.length).toBe(GrassConstants.GRASS_BUFFER_LAYOUT.length);

        GrassConstants.GRASS_BUFFER_LAYOUT.forEach((schema) => {
            const allocatedBuffer = attributeList[schema.index];
            expect(allocatedBuffer.name).toBe(schema.name);
            expect(allocatedBuffer.itemSize).toBe(schema.itemSize);
            expect(allocatedBuffer.storage.length).toBe(totalBlades * schema.itemSize);
        });
    });

    it('should ensure no memory is shared between separate allocation calls for any attribute', () => {
        const firstAllocation = BufferAllocator.allocateBuffers(totalBlades);
        const secondAllocation = BufferAllocator.allocateBuffers(totalBlades);

        GrassConstants.GRASS_BUFFER_LAYOUT.forEach((schema) => {
            const index = schema.index;
            expect(firstAllocation.attributeList[index].storage)
                .not.toBe(secondAllocation.attributeList[index].storage);
        });
    });

    it('should pass the newly allocated attribute list directly to the GrassAttributeAccessor', () => {        
        const { attributeList } = BufferAllocator.allocateBuffers(totalBlades);

        expect(GrassAttributeAccessor).toHaveBeenCalledTimes(1);
        expect(GrassAttributeAccessor).toHaveBeenCalledWith(attributeList);
    });
});