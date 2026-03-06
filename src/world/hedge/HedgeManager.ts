import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { InstancedMeshFactory } from '../../engine/factories/InstancedMeshFactory';
import type { SceneController } from '../scene/SceneController';
import { AssetRegister } from '../../utils/copyright/AssetRegister';
import { perimeterPlacementGenerate } from '../../utils/math/PerimeterMatrixGenerater';

export class HedgeManager {
    private loader = new GLTFLoader();
    private sceneController: SceneController;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
    }

    public async initialise(): Promise<void> {
        await this.spawnTrees('models/LargeHedge.glb');
    }

    public async spawnTrees(modelPath: string): Promise<void> {
        AssetRegister.registerByPath(modelPath);
        const gltf = await this.loader.loadAsync(modelPath);
        const matrices = perimeterPlacementGenerate();

        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.alphaTest = 0.5;
                child.material.transparent = false; 
                child.material.depthWrite = true;
                child.material.depthTest = true;
                child.material.needsUpdate = true;

                const instancedMesh = InstancedMeshFactory.create(child, matrices);
                this.sceneController.add(instancedMesh);
            }
        });
    }
}