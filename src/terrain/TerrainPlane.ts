import * as THREE from 'three';
import { TerrainHeightService } from './services/TerrainHeightService';
import { RESOLUTION, WORLD_SIZE } from './Constants';
import type { SceneController } from '../scene/SceneController';

export class TerrainPlane {
    private mesh: THREE.Mesh;
    public static WORLD_SIZE = 200;
    public static RESOLUTION = 256;

    constructor(sceneController: SceneController) {
        const size = WORLD_SIZE;
        const segments = RESOLUTION - 1; 

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

        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3d2b1f, 
            side: THREE.FrontSide 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        sceneController.add(this.mesh);
    }
}