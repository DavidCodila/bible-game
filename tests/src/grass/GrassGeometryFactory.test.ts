// @vitest-environment node
import { GrassGeometryFactory } from '@src/grass/GrassGeometryFactory';
import type { GrassBladeConfig } from '@src/grass/types';
import type { BufferAttribute, BufferGeometry, InterleavedBufferAttribute } from 'three';

describe('GrassGeometryFactory', () => {
    let grassBladeConfig: GrassBladeConfig;
    let geometry : BufferGeometry;
    let position : BufferAttribute | InterleavedBufferAttribute;

    beforeEach(() => {
        grassBladeConfig = {
            bladeHeight: 2.0,
            bladeWidth: 1.0,
            segmentsPerBlade: 2
        };
        geometry = GrassGeometryFactory.createBladeGeometry(grassBladeConfig);
        position = geometry.getAttribute('position');
    });

    it('should generate exactly (segments + 1) * 2 vertices', () => {
        const expectedCount = (grassBladeConfig.segmentsPerBlade + 1) * 2;
        expect(position.count).toBe(expectedCount);
    });

    it('should place vertices at correct height intervals', () => {
        // Base: Y=0, Mid: Y=1.0, Tip: Y=2.0
        expect(position.getY(0)).toBe(0);   // Base Left
        expect(position.getY(2)).toBe(1.0); // Mid Left
        expect(position.getY(4)).toBe(2.0); // Tip Left
    });

    it('should scale the width of each segment using the taper formula', () => {
        // Base width: Left(-0.5) to Right(0.5) = 1.0
        expect(position.getX(1) - position.getX(0)).toBeCloseTo(1.0);

        // Tip width: Taper(1.0) = 0.0
        expect(position.getX(5) - position.getX(4)).toBe(0);
    });

    it('should define the first segment quad with correct counter-clockwise winding', () => {
        const indexAttribute = geometry.getIndex();
        expect(indexAttribute).not.toBeNull();

        // The index buffer is a flat list of vertex IDs. 
        // Each segment has 2 triangles, so 6 indices total.
        const indices = Array.from(indexAttribute!.array).slice(0, 6);

        // Segment 0 vertex mapping:
        // 0: Bottom-Left,  1: Bottom-Right
        // 2: Top-Left,     3: Top-Right
        const [
            bottomLeft, bottomRight, topLeft,  // Triangle 1
            bottomRight2, topRight, topLeft2 // Triangle 2
        ] = indices;

        // First Triangle: Bottom-Left -> Bottom-Right -> Top-Left
        expect([bottomLeft, bottomRight, topLeft]).toEqual([0, 1, 2]);

        // Second Triangle: Bottom-Right -> Top-Right -> Top-Left
        // This completes the rectangular segment
        expect([bottomRight2, topRight, topLeft2]).toEqual([1, 3, 2]);
    });

    it('should compute surface normals that point toward the viewer (positive Z)', () => {
        const normals = geometry.getAttribute('normal');
        // A flat XY plane geometry should have normals pointing straight out at +Z
        expect(normals.getZ(0)).toBeCloseTo(1);
    });

    it('should name the position attribute correctly for the shader to find', () => {
        expect(geometry.getAttribute('position')).toBeDefined();
        expect(geometry.getAttribute('normal')).toBeDefined();
    });
});