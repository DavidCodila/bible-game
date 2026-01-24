import { INSTANCE_INDICES } from "./GrassConstants";
import type { AttributeBuffer } from "../../../types/rendering";

export class GrassAttributeAccessor {
    public readonly offsets: Float32Array;
    public readonly colors: Float32Array;
    public readonly yAxisRotation: Float32Array;
    public readonly yAxisScale: Float32Array;
    public readonly bendXAxis: Float32Array;
    public readonly bendZAxis: Float32Array;

    constructor(attributeList: AttributeBuffer[]) {
        this.offsets = attributeList[INSTANCE_INDICES.OFFSETS].storage;
        this.colors = attributeList[INSTANCE_INDICES.COLORS].storage;
        this.yAxisRotation = attributeList[INSTANCE_INDICES.Y_AXIS_ROTATION].storage;
        this.yAxisScale = attributeList[INSTANCE_INDICES.Y_AXIS_SCALE].storage;
        this.bendXAxis = attributeList[INSTANCE_INDICES.BEND_X_AXIS].storage;
        this.bendZAxis = attributeList[INSTANCE_INDICES.BEND_Z_AXIS].storage;
    }
}