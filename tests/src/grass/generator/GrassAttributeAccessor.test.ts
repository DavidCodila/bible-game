import { GrassAttributeAccessor } from "@src/grass/generator/GrassAttributeAccessor";
import * as GrassConstants from "@src/grass/generator/GrassConstants";
import type { AttributeBuffer } from "@src/types/rendering";

describe('GrassAttributeAccessor', () => {
    it('should map each buffer to the correct property using the validated constants', () => {
        const attributeList: AttributeBuffer[] = [];

        const offsetsStorage = new Float32Array([1]);
        const colorsStorage = new Float32Array([2]);
        const rotationStorage = new Float32Array([3]);
        const scaleStorage = new Float32Array([4]);
        const bendXStorage = new Float32Array([5]);
        const bendZStorage = new Float32Array([6]);

        attributeList[GrassConstants.INSTANCE_INDICES.OFFSETS] = { 
            storage: offsetsStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.OFFSETS, 
            itemSize: GrassConstants.DATA_SIZE.VECTOR_3 
        };
        attributeList[GrassConstants.INSTANCE_INDICES.COLORS] = { 
            storage: colorsStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.COLORS, 
            itemSize: GrassConstants.DATA_SIZE.VECTOR_3 
        };
        attributeList[GrassConstants.INSTANCE_INDICES.Y_AXIS_ROTATION] = { 
            storage: rotationStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.Y_AXIS_ROTATION, 
            itemSize: GrassConstants.DATA_SIZE.SCALAR 
        };
        attributeList[GrassConstants.INSTANCE_INDICES.Y_AXIS_SCALE] = { 
            storage: scaleStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.Y_AXIS_SCALE, 
            itemSize: GrassConstants.DATA_SIZE.SCALAR 
        };
        attributeList[GrassConstants.INSTANCE_INDICES.BEND_X_AXIS] = { 
            storage: bendXStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.BEND_X_AXIS, 
            itemSize: GrassConstants.DATA_SIZE.SCALAR 
        };
        attributeList[GrassConstants.INSTANCE_INDICES.BEND_Z_AXIS] = { 
            storage: bendZStorage, 
            name: GrassConstants.GRASS_ATTRIBUTES.BEND_Z_AXIS, 
            itemSize: GrassConstants.DATA_SIZE.SCALAR 
        };

        const accessor = new GrassAttributeAccessor(attributeList);

        expect(accessor.offsets).toBe(offsetsStorage);
        expect(accessor.colors).toBe(colorsStorage);
        expect(accessor.yAxisRotation).toBe(rotationStorage);
        expect(accessor.yAxisScale).toBe(scaleStorage);
        expect(accessor.bendXAxis).toBe(bendXStorage);
        expect(accessor.bendZAxis).toBe(bendZStorage);
    });
});