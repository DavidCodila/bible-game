export const  INSTANCE_INDICES = {
    OFFSETS: 0,
    COLORS: 1,
    Y_AXIS_ROTATION: 2,
    Y_AXIS_SCALE: 3,
    BEND_X_AXIS: 4,
    BEND_Z_AXIS: 5
} as const;

export const DATA_SIZE = {
    SCALAR: 1,
    VECTOR_3: 3
} as const;

export const GRASS_ATTRIBUTES = {
    OFFSETS: "instanceOffsets",
    COLORS: "instanceColors",
    Y_AXIS_ROTATION: "instanceYAxisRotation",
    Y_AXIS_SCALE: "instanceScaleY",
    BEND_X_AXIS: "instanceBendX",
    BEND_Z_AXIS: "instanceBendZ"
} as const;

export const GRASS_BUFFER_LAYOUT = [
    { name: GRASS_ATTRIBUTES.OFFSETS,           itemSize: DATA_SIZE.VECTOR_3, index: INSTANCE_INDICES.OFFSETS },
    { name: GRASS_ATTRIBUTES.COLORS,            itemSize: DATA_SIZE.VECTOR_3, index: INSTANCE_INDICES.COLORS },
    { name: GRASS_ATTRIBUTES.Y_AXIS_ROTATION,   itemSize: DATA_SIZE.SCALAR, index: INSTANCE_INDICES.Y_AXIS_ROTATION },
    { name: GRASS_ATTRIBUTES.Y_AXIS_SCALE,      itemSize: DATA_SIZE.SCALAR, index: INSTANCE_INDICES.Y_AXIS_SCALE },
    { name: GRASS_ATTRIBUTES.BEND_X_AXIS,       itemSize: DATA_SIZE.SCALAR, index: INSTANCE_INDICES.BEND_X_AXIS },
    { name: GRASS_ATTRIBUTES.BEND_Z_AXIS,       itemSize: DATA_SIZE.SCALAR, index: INSTANCE_INDICES.BEND_Z_AXIS }
] as const;

export const VECTOR_OFFSETS = {
    ARRAY_3D_OFFSET: 3,
    X_OFFSET: 0,
    Y_OFFSET: 1, 
    Z_OFFSET: 2
} as const;

export const COLOR_INDICES = {
    RED: 0,
    GREEN: 1,
    BLUE: 2
} as const;

export const JITTER_BUFFER = 0.8;