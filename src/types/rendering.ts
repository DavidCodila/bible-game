/**
 * Represents a single buffer for a WebGL attribute.
 */
export interface AttributeBuffer {
    name: string;
    itemSize: number;
    data: Float32Array;
}

/**
 * A collection of attributes that can be bound to any InstancedMesh.
 */
export interface InstancedAttributeData {
    attributes: AttributeBuffer[];
}