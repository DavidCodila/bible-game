import * as THREE from 'three';
import { TerrainHeightService } from './services/TerrainHeightService';
import type { SceneController } from '../scene/SceneController';
import { WORLD_SIZE_METERS, HEIGHTMAP_RESOLUTION } from '../WorldConfig';

export class TerrainPlane {
    private mesh: THREE.Mesh;

    constructor(sceneController: SceneController) {
        const size = WORLD_SIZE_METERS;
        const segments = HEIGHTMAP_RESOLUTION - 1; 

        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        geometry.rotateX(-Math.PI / 2);

        const positionAttribute = geometry.getAttribute('position');

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);

            const height = TerrainHeightService.getHeight(x, z);
            positionAttribute.setY(i, height);
        }

        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({ 
            color: 0x000000, 
            side: THREE.FrontSide 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        sceneController.add(this.mesh);
    }
}