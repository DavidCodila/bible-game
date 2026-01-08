import * as THREE from 'three';

export function initialiseCamera(camera : THREE.PerspectiveCamera) : THREE.PerspectiveCamera {
    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.set(0, 1.8, 0);
    camera.rotation.order = 'YXZ';
    camera.updateProjectionMatrix();
    return camera;
}