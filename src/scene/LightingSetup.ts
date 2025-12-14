import * as THREE from 'three';

/**
 * Initializes and adds all light sources to the scene.
 */
export function setupSceneLights(scene: THREE.Scene): void {
    // 1. Ambient Light (Soft fill)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); 
    scene.add(ambientLight);

    // 2. Directional Light (Sun/Key light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 5); 
    directionalLight.castShadow = false; // Set to false by default (due to performance warning)
    scene.add(directionalLight);
    
    // Note: If this function needs to return a complex light setup, 
    // it could return an array or object containing the lights for later access.
}