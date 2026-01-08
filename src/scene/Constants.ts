import * as THREE from 'three';
export const FOG_COLOR = 0xf9d1b1;
export const FOG_DENSITY = 0.02;
export const SUN_DIRECTION = new THREE.Vector3();

const elevation = 2.0; 
const azimuth = 180;
const phi = THREE.MathUtils.degToRad(90 - elevation);
const theta = THREE.MathUtils.degToRad(azimuth);

SUN_DIRECTION.setFromSphericalCoords(1, phi, theta).normalize();