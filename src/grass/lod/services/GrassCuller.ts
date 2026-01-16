import * as THREE from 'three';
import { GrassLODPatch } from '../model/GrassLODPatch';
import { BEHIND_CAMERA_THRESHOLD_BUFFER } from '../Constants';

const _cameraDirection = new THREE.Vector3();
const _vectorToPatch = new THREE.Vector3();

export const GrassCuller = {
    cull(
        camera: THREE.Camera, 
        allPatches: GrassLODPatch[], 
        outVisibleArray: GrassLODPatch[]
    ): number { // Change return type to number
        camera.getWorldDirection(_cameraDirection);
        let count = 0;

        for (let i = 0; i < allPatches.length; i++) {
            const patch = allPatches[i];
            _vectorToPatch.copy(patch.worldPosition).sub(camera.position);
            const dot = _vectorToPatch.dot(_cameraDirection);
            
            const isVisible = dot >= BEHIND_CAMERA_THRESHOLD_BUFFER;
            patch.mesh.visible = isVisible;

            if (isVisible) {
                outVisibleArray[count] = patch;
                count++;
            }
        }
        return count; // Return how many were actually found
    }
};