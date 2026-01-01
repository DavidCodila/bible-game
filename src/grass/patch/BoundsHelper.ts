import type { GrassPatchConfig } from "../types";

export class BoundsHelper {
    public static computePatchBounds(mesh: THREE.InstancedMesh, config: GrassPatchConfig): void {
        mesh.geometry.computeBoundingSphere();
        const sphere = mesh.geometry.boundingSphere;
        
        if (sphere) {
            const bladeHeight = config.grassBladeConfig.bladeHeight;
            
            const patchDiagonalHalf = config.sideLength * Math.SQRT2 / 2;
            sphere.radius = patchDiagonalHalf + bladeHeight;
        }
    }
}