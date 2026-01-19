import * as THREE from 'three';
import { TerrainHeightService } from '../../terrain/services/TerrainHeightService';

export function initialiseCamera(camera : THREE.PerspectiveCamera) : THREE.PerspectiveCamera {
    const startX = 0;
    const startZ = 0;
    const groundHeight = TerrainHeightService.getHeight(startX, startZ);
    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.set(startX, groundHeight + 2, startZ);
    camera.rotation.order = 'YXZ';
    camera.updateProjectionMatrix();
    return camera;
}