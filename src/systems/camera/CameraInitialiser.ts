import * as THREE from 'three';
import { TerrainHeightService } from '../../world/terrain/services/TerrainHeightService';

export function initialiseCamera(camera : THREE.PerspectiveCamera, audioListener: THREE.AudioListener) : THREE.PerspectiveCamera {
    const startX = 0;
    const startZ = 4;
    const groundHeight = TerrainHeightService.getHeight(startX, startZ);
    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.set(startX, groundHeight + 2, startZ);
    camera.rotation.order = 'YXZ';
    camera.add(audioListener);
    camera.updateProjectionMatrix();
    return camera;
}