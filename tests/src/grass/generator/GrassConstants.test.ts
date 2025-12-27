import * as GrassConstants from "@src/grass/generator/GrassConstants"

describe('GrassConstants', () => {

    it('should define correct instance indices for the GPU buffer', () => {
        expect(GrassConstants.INSTANCE_INDICES.OFFSETS).toBe(0);
        expect(GrassConstants.INSTANCE_INDICES.COLORS).toBe(1);
        expect(GrassConstants.INSTANCE_INDICES.Y_AXIS_ROTATION).toBe(2);
        expect(GrassConstants.INSTANCE_INDICES.Y_AXIS_SCALE).toBe(3);
        expect(GrassConstants.INSTANCE_INDICES.BEND_X_AXIS).toBe(4);
        expect(GrassConstants.INSTANCE_INDICES.BEND_Z_AXIS).toBe(5);
    });

    it('should define standard data sizes for WebGL attributes', () => {
        expect(GrassConstants.DATA_SIZE.SCALAR).toBe(1);
        expect(GrassConstants.DATA_SIZE.VECTOR_3).toBe(3);
    });

    it('should have a correctly ordered and complete GRASS_BUFFER_LAYOUT', () => {
        const layout = GrassConstants.GRASS_BUFFER_LAYOUT;

        expect(layout.length).toBe(6);

        expect(layout[0]).toEqual({
            name: "instanceOffsets",
            itemSize: 3,
            index: 0
        });

        expect(layout[1]).toEqual({
            name: "instanceColors",
            itemSize: 3,
            index: 1
        });

        expect(layout[2]).toEqual({
            name: "instanceYAxisRotation",
            itemSize: 1,
            index: 2
        });

        expect(layout[3]).toEqual({
            name: "instanceScaleY",
            itemSize: 1,
            index: 3
        });

        expect(layout[4]).toEqual({
            name: "instanceBendX",
            itemSize: 1,
            index: 4
        });

        expect(layout[5]).toEqual({
            name: "instanceBendZ",
            itemSize: 1,
            index: 5
        });

        expect(layout[0].name).toBe(GrassConstants.GRASS_ATTRIBUTES.OFFSETS);
        expect(layout[1].name).toBe(GrassConstants.GRASS_ATTRIBUTES.COLORS);
        expect(layout[2].name).toBe(GrassConstants.GRASS_ATTRIBUTES.Y_AXIS_ROTATION);
        expect(layout[3].name).toBe(GrassConstants.GRASS_ATTRIBUTES.Y_AXIS_SCALE);
        expect(layout[4].name).toBe(GrassConstants.GRASS_ATTRIBUTES.BEND_X_AXIS);
        expect(layout[5].name).toBe(GrassConstants.GRASS_ATTRIBUTES.BEND_Z_AXIS);
    });

    it('should define correct internal vector offsets and color indices', () => {
        expect(GrassConstants.VECTOR_OFFSETS.X_OFFSET).toBe(0);
        expect(GrassConstants.VECTOR_OFFSETS.Y_OFFSET).toBe(1);
        expect(GrassConstants.VECTOR_OFFSETS.Z_OFFSET).toBe(2);
        expect(GrassConstants.VECTOR_OFFSETS.ARRAY_3D_OFFSET).toBe(3);

        expect(GrassConstants.COLOR_INDICES.RED).toBe(0);
        expect(GrassConstants.COLOR_INDICES.GREEN).toBe(1);
        expect(GrassConstants.COLOR_INDICES.BLUE).toBe(2);
    });

    it('should maintain the correct jitter buffer value', () => {
        expect(GrassConstants.JITTER_BUFFER).toBe(0.8);
    });
});