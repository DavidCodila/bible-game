import * as GrassConstants from "./GrassConstants";
import type { InstancedAttributeData } from "../../types/rendering";

export class GrassAttributeAccessor {
    public readonly offsets: Float32Array;
    public readonly colors: Float32Array;
    public readonly yAxisRotation: Float32Array;
    public readonly yAxisScale: Float32Array;
    public readonly bendXAxis: Float32Array;
    public readonly bendZAxis: Float32Array;

    constructor(attributeData: InstancedAttributeData) {
        const attributes = attributeData.attributeList;
        
        this.offsets = attributes[GrassConstants.INSTANCE_OFFSETS_INDEX].storage;
        this.colors = attributes[GrassConstants.INSTANCE_COLORS_INDEX].storage;
        this.yAxisRotation = attributes[GrassConstants.INSTANCE_Y_AXIS_ROTATION_INDEX].storage;
        this.yAxisScale = attributes[GrassConstants.INSTANCE_Y_AXIS_SCALE_INDEX].storage;
        this.bendXAxis = attributes[GrassConstants.INSTANCE_BEND_X_AXIS_INDEX].storage;
        this.bendZAxis = attributes[GrassConstants.INSTANCE_BEND_Z_AXIS_INDEX].storage;
    }
}