import * as THREE from 'three';
import { TerrainHeightService } from '../terrain/services/TerrainHeightService';
import type { SceneController } from './SceneController';

export class TerrainPlane {
    private mesh: THREE.Mesh;

    constructor(sceneController: SceneController) {
        // Accessing the now-static WORLD_SIZE
        const size = TerrainHeightService.WORLD_SIZE;
        const segments = 128; 

        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        geometry.rotateX(-Math.PI / 2);

        const positionAttribute = geometry.getAttribute('position');

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);

            // This now works because getHeight is static
            const height = TerrainHeightService.getHeight(x, z);
            positionAttribute.setY(i, height);
        }

        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3d2b1f, 
            side: THREE.DoubleSide 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        sceneController.add(this.mesh);
    }
}