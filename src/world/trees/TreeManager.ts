import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MatrixPlacer } from '../../utils/math/MatrixPlacer';
import { InstancedMeshFactory } from '../../engine/factories/InstancedMeshFactory';
import type { SceneController } from '../scene/SceneController';
import { AssetRegister } from '../../utils/copyright/AssetRegister';

export class TreeManager {
    private loader = new GLTFLoader();
    private sceneController: SceneController;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
    }

    public async initialise(): Promise<void> {
        await this.spawnTrees('models/Pine_Tree_Large_LOD0_v1.glb', 1);
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v2.glb', 5);
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v3.glb', 5);
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v3.glb', 5);
    }

    public async spawnTrees(modelPath: string, count: number): Promise<void> {
        AssetRegister.registerByPath(modelPath);
        const gltf = await this.loader.loadAsync(modelPath);
        const matrices = MatrixPlacer.generate(count);

        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const instancedMesh = InstancedMeshFactory.create(child, matrices);
                this.sceneController.add(instancedMesh);
            }
        });
    }
}