import { GrassAttributeAccessor } from "./GrassAttributeAccessor";
import { GRASS_BUFFER_LAYOUT } from "./GrassConstants"
import type { AttributeBuffer, InstancedAttributeData } from "@src/types/rendering";

export class BufferAllocator {
    public static allocateBuffers(totalBlades: number): InstancedAttributeData {
        const bufferCollection: AttributeBuffer[] = [];

        GRASS_BUFFER_LAYOUT.forEach((schema) => {
            bufferCollection[schema.index] = {
                name: schema.name,
                itemSize: schema.itemSize,
                storage: new Float32Array(totalBlades * schema.itemSize)
            };
        });

        return { attributeList: bufferCollection, accessor : new GrassAttributeAccessor(bufferCollection) };
    }
}