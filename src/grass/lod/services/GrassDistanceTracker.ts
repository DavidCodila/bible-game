import * as THREE from 'three';
import { GrassLODPatch } from '../model/GrassLODPatch';

export class GrassDistanceTracker {
    public updateDistances(camera: THREE.Camera, visiblePatches: GrassLODPatch[]): void {
        const cameraPos = camera.position;

        for (let i = 0; i < visiblePatches.length; i++) {
            const patch = visiblePatches[i];
            const distanceSquared = cameraPos.distanceToSquared(patch.worldPosition);

            patch.setDistanceMetric(distanceSquared);
        }
    }
}