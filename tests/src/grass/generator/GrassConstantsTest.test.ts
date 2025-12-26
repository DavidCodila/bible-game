import * as GrassConstants from "@src/grass/generator/GrassConstants"

describe('GrassConstants', () => {

    it('should have the exact index values required by the GPU layout', () => {
        expect(GrassConstants.INSTANCE_OFFSETS_INDEX).toBe(0);
        expect(GrassConstants.INSTANCE_COLORS_INDEX).toBe(1);
        expect(GrassConstants.INSTANCE_Y_AXIS_ROTATION_INDEX).toBe(2);
        expect(GrassConstants.INSTANCE_Y_AXIS_SCALE_INDEX).toBe(3);
        expect(GrassConstants.INSTANCE_BEND_X_AXIS_INDEX).toBe(4);
        expect(GrassConstants.INSTANCE_BEND_Z_AXIS_INDEX).toBe(5);
    });

    it('should have a correctly ordered and complete GRASS_BUFFER_LAYOUT', () => {
        const layout = GrassConstants.GRASS_BUFFER_LAYOUT;

        expect(layout.length).toBe(6);

        expect(layout[0]).toEqual({ name: "instanceOffsets", itemSize: 3, index: 0 });
        expect(layout[1]).toEqual({ name: "instanceColors", itemSize: 3, index: 1 });
        expect(layout[2]).toEqual({ name: "instanceYAxisRotation", itemSize: 1, index: 2 });
        expect(layout[3]).toEqual({ name: "instanceScaleY", itemSize: 1, index: 3 });
        expect(layout[4]).toEqual({ name: "instanceBendX", itemSize: 1, index: 4 });
        expect(layout[5]).toEqual({ name: "instanceBendZ", itemSize: 1, index: 5 });
    });

    it('should have correct component offsets and vector lengths', () => {
        expect(GrassConstants.X_OFFSET).toBe(0);
        expect(GrassConstants.Y_OFFSET).toBe(1);
        expect(GrassConstants.Z_OFFSET).toBe(2);

        expect(GrassConstants.RED_INDEX).toBe(0);
        expect(GrassConstants.GREEN_INDEX).toBe(1);
        expect(GrassConstants.BLUE_INDEX).toBe(2);
        
        expect(GrassConstants.ARRAY_3D_OFFSET).toBe(3);
    });
});