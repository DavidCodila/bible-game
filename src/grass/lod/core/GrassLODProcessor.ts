import * as THREE from 'three';
import { GrassLODPatch } from '../model/GrassLODPatch';
import { GrassCuller } from '../services/GrassCuller';
import { LODCalculator } from '../utils/LODCalculator';
import { GrassLODOrchestrator } from './GrassLODOrchestrator';

export class GrassLODProcessor {
    public static updateSpatialState(camera: THREE.Camera,  allPatches: GrassLODPatch[], outVisiblePatches: GrassLODPatch[]): number {
        const count = GrassCuller.cull(camera, allPatches, outVisiblePatches);

        for (let i = 0; i < count; i++) {
            const patch = outVisiblePatches[i];
            patch.setDistanceMetric(camera.position.distanceToSquared(patch.worldPosition));
        }

        return count;
    }

    public static evaluateTransitions(visiblePatches: GrassLODPatch[], count: number, orchestrator: GrassLODOrchestrator): void {
        for (let i = 0; i < count; i++) {
            const patch = visiblePatches[i];

            if (orchestrator.isTransitioning(patch.id)) continue;

            const targetLevel = LODCalculator.getTargetLevel(
                patch.cachedDistanceSquared,
                patch.currentLODLevel
            );

            if (targetLevel !== patch.currentLODLevel) {
                orchestrator.beginSwap(patch, targetLevel);
            }
        }
    }
}