import * as THREE from 'three';
import type { GrassPatchConfig } from "../types";
import { TerrainHeightService } from '../../terrain/services/TerrainHeightService';

export class BoundsHelper {
    public static computePatchBounds(mesh: THREE.InstancedMesh, config: GrassPatchConfig): void {
        mesh.geometry.computeBoundingSphere();
        const sphere = mesh.geometry.boundingSphere;
        
        if (sphere) {
            const halfSide = config.sideLength / 2;
            const px = mesh.position.x;
            const pz = mesh.position.z;

            // 1. Sample all 4 corners + center to find the height range
            const h1 = TerrainHeightService.getHeight(px - halfSide, pz - halfSide);
            const h2 = TerrainHeightService.getHeight(px + halfSide, pz - halfSide);
            const h3 = TerrainHeightService.getHeight(px - halfSide, pz + halfSide);
            const h4 = TerrainHeightService.getHeight(px + halfSide, pz + halfSide);
            const h5 = TerrainHeightService.getHeight(px, pz); // Center

            const minH = Math.min(h1, h2, h3, h4, h5);
            const maxH = Math.max(h1, h2, h3, h4, h5);
            
            const bladeHeight = config.grassBladeConfig.bladeHeight;
            
            // 2. The total vertical span is (Max Height + Blade Height) - (Min Height)
            const totalTop = maxH + bladeHeight;
            const totalBottom = minH;
            
            // 3. Set center exactly in the middle of that vertical volume
            const midY = (totalTop + totalBottom) / 2;
            sphere.center.set(0, midY, 0);

            // 4. Calculate the radius to reach the furthest corner (top or bottom)
            const verticalHalfSpan = (totalTop - totalBottom) / 2;
            
            // Use the Pythagorean theorem for the 3D distance from center to corner
            const radius = Math.sqrt(
                (halfSide * halfSide) + // X distance
                (halfSide * halfSide) + // Z distance
                (verticalHalfSpan * verticalHalfSpan) // Y distance
            );

            sphere.radius = radius + 2.0; // 2.0 safety buffer for wind/slopes
        }
    }
}