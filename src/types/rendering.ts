import type { GrassAttributeAccessor } from "../grass/generator/GrassAttributeAccessor";

/**
 * Represents a single buffer for a WebGL attribute.
 */
export interface AttributeBuffer {
    name: string;
    itemSize: number;
    storage: Float32Array;
}

/**
 * A collection of attributes that can be bound to any InstancedMesh.
 */
export interface InstancedAttributeData {
    attributeList: AttributeBuffer[];
    accessor: GrassAttributeAccessor;
}