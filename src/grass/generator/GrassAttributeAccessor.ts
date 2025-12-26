import * as GrassConstants from "./GrassConstants";
import type { AttributeBuffer } from "../../types/rendering";

export class GrassAttributeAccessor {
    public readonly offsets: Float32Array;
    public readonly colors: Float32Array;
    public readonly yAxisRotation: Float32Array;
    public readonly yAxisScale: Float32Array;
    public readonly bendXAxis: Float32Array;
    public readonly bendZAxis: Float32Array;

    constructor(attributeList: AttributeBuffer[]) {
        this.offsets = attributeList[GrassConstants.INSTANCE_OFFSETS_INDEX].storage;
        this.colors = attributeList[GrassConstants.INSTANCE_COLORS_INDEX].storage;
        this.yAxisRotation = attributeList[GrassConstants.INSTANCE_Y_AXIS_ROTATION_INDEX].storage;
        this.yAxisScale = attributeList[GrassConstants.INSTANCE_Y_AXIS_SCALE_INDEX].storage;
        this.bendXAxis = attributeList[GrassConstants.INSTANCE_BEND_X_AXIS_INDEX].storage;
        this.bendZAxis = attributeList[GrassConstants.INSTANCE_BEND_Z_AXIS_INDEX].storage;
    }
}