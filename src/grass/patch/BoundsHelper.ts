import * as THREE from 'three';
import type { GrassPatchConfig } from "../types";

export class BoundsHelper {
    public static computePatchBounds(mesh: THREE.InstancedMesh, config: GrassPatchConfig): void {
        mesh.geometry.computeBoundingSphere();
        const sphere = mesh.geometry.boundingSphere;
        
        if (sphere) {
            const bladeHeight = config.grassBladeConfig.bladeHeight;
            const halfSideLength = config.sideLength / 2;
            const radius = Math.sqrt(
                (halfSideLength * halfSideLength) + 
                (halfSideLength * halfSideLength) + 
                (bladeHeight * bladeHeight)
            );

            sphere.radius = radius;
        }
    }
}