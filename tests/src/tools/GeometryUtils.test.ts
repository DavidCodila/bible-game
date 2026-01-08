// @vitest-environment node
import * as THREE from 'three';
import { GeometryUtils, clamp, defaultBladeTaper } from '../../../src/tools/GeometryUtils';
import { GrassAttributeAccessor } from '../../../src/grass/generator/GrassAttributeAccessor';
import type { InstancedAttributeData, AttributeBuffer } from "../../../src/types/rendering";

describe('GeometryUtils', () => {
    let bufferGeometry: THREE.BufferGeometry;

    // Helper to create valid data that satisfies the Accessor class requirements
    const createValidAttributeData = (): InstancedAttributeData => {
        const attributeList: AttributeBuffer[] = [];
        // Fill all required indices (0 through 5) defined in GrassConstants
        [0, 1, 2, 3, 4, 5].forEach(index => {
            attributeList[index] = {
                name: `attr_${index}`,
                itemSize: 3,
                storage: new Float32Array(3)
            };
        });

        return {
            attributeList,
            accessor: new GrassAttributeAccessor(attributeList)
        };
    };

    beforeEach(() => {
        bufferGeometry = new THREE.BufferGeometry();
    });

    it('should bind all attributes in the list as InstancedBufferAttributes', () => {
        const attributeData = createValidAttributeData();

        GeometryUtils.assignInstancedAttributes(bufferGeometry, attributeData);

        // Verify the first and last expected attributes exist on the geometry
        expect(bufferGeometry.getAttribute('attr_0')).toBeInstanceOf(THREE.InstancedBufferAttribute);
        expect(bufferGeometry.getAttribute('attr_5')).toBeInstanceOf(THREE.InstancedBufferAttribute);
    });

    it('should link the attribute to the storage buffer without copying data', () => {
        const storage = new Float32Array([10, 20, 30]);
        const data: InstancedAttributeData = {
            attributeList: [{ name: 'test', storage, itemSize: 3 }],
            accessor: {} as any 
        };

        GeometryUtils.assignInstancedAttributes(bufferGeometry, data);

        const attribute = bufferGeometry.getAttribute('test') as THREE.InstancedBufferAttribute;
        
        expect(attribute.array).toBe(storage);
        });
    });

describe('clamp', () => {
    it('should return the value if it is within range', () => {
        expect(clamp(0.5, 0, 1)).toBe(0.5);
    });

    it('should return the minimum if the value is below range', () => {
        expect(clamp(-10, 0, 1)).toBe(0);
    });

    it('should return the maximum if the value is above range', () => {
        expect(clamp(10, 0, 1)).toBe(1);
    });
});

describe('defaultBladeTaper', () => {
    it('should calculate the quadratic width correctly at different heights', () => {
        expect(defaultBladeTaper(0.0)).toBe(1.0);
        
        expect(defaultBladeTaper(0.5)).toBe(0.75);
        
        expect(defaultBladeTaper(1.0)).toBe(0.0);
    });

    it('should stay at 0.0 even if height exceeds 1.0', () => {
        expect(defaultBladeTaper(1.5)).toBe(0);
    });

    it('should stay at 1.0 even if height is negative', () => {
        expect(defaultBladeTaper(-0.5)).toBe(1);
    });
});