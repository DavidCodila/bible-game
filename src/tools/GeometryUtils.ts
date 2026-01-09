import * as THREE from 'three';
import type { InstancedAttributeData } from "../types/rendering";

export class GeometryUtils {
    /**
     * Iterates through the self-describing attribute list and binds them to geometry.
     */
    public static assignInstancedAttributes( geometry: THREE.BufferGeometry, attributeData: InstancedAttributeData): void {
        attributeData.attributeList.forEach((attribute) => {
            geometry.setAttribute(attribute.name, new THREE.InstancedBufferAttribute(attribute.storage, attribute.itemSize));
        });
    }
}

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

// Helper function to taper the width (1.0 at base, 0.0 at tip)
export const defaultBladeTaper = (normalizedHeight: number): number => {
    const safeHeight = clamp(normalizedHeight, 0, 1);
    return 1.0 - (safeHeight * safeHeight);
};

export function assignForwardVector(vector: THREE.Vector3, yaw: number): void {
    vector.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
}