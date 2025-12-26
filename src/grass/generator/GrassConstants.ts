export const INSTANCE_OFFSETS_INDEX = 0;
export const INSTANCE_COLORS_INDEX = 1;
export const INSTANCE_Y_AXIS_ROTATION_INDEX = 2;
export const INSTANCE_Y_AXIS_SCALE_INDEX = 3;
export const INSTANCE_BEND_X_AXIS_INDEX = 4;
export const INSTANCE_BEND_Z_AXIS_INDEX = 5;

export const GRASS_BUFFER_LAYOUT = [
    { name: "instanceOffsets",      itemSize: 3, index: INSTANCE_OFFSETS_INDEX },
    { name: "instanceColors",       itemSize: 3, index: INSTANCE_COLORS_INDEX },
    { name: "instanceYAxisRotation", itemSize: 1, index: INSTANCE_Y_AXIS_ROTATION_INDEX },
    { name: "instanceScaleY",        itemSize: 1, index: INSTANCE_Y_AXIS_SCALE_INDEX },
    { name: "instanceBendX",         itemSize: 1, index: INSTANCE_BEND_X_AXIS_INDEX },
    { name: "instanceBendZ",         itemSize: 1, index: INSTANCE_BEND_Z_AXIS_INDEX }
] as const;

export const JITTER_BUFFER = 0.8;
export const ARRAY_3D_OFFSET = 3;
export const X_OFFSET = 0; 
export const Y_OFFSET = 1; 
export const Z_OFFSET = 2;
export const RED_INDEX = 0;
export const GREEN_INDEX = 1;
export const BLUE_INDEX = 2;