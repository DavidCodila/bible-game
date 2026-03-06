import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MatrixPlacer } from '../../utils/math/MatrixPlacer';
import { InstancedMeshFactory } from '../../engine/factories/InstancedMeshFactory';
import type { SceneController } from '../scene/SceneController';
import { AssetRegister } from '../../utils/copyright/AssetRegister';
import { TreeShader } from './shaders/TreeShader';
import type { WindService } from '../wind/WindService';

export class TreeManager {
    private loader = new GLTFLoader();
    private sceneController: SceneController;
    private treeShader: TreeShader;
    private matrixPlacer: MatrixPlacer;

    constructor(sceneController: SceneController, windService: WindService) {
        this.sceneController = sceneController;
        this.treeShader = new TreeShader(windService);
        this.matrixPlacer = MatrixPlacer.getInstance();
    }

    public async initialise(): Promise<void> {
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v1.glb', 3);
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v2.glb', 3);
        await this.spawnTrees('models/Pine_Tree_Small_LOD0_v3.glb', 3);
    }

    public async spawnTrees(modelPath: string, count: number): Promise<void> {
        AssetRegister.registerByPath(modelPath);
        const gltf = await this.loader.loadAsync(modelPath);
        const matrices = this.matrixPlacer.generateRandomPlacement(count);

        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
                //child.material.side = THREE.DoubleSide;
                //child.material.emissive = new THREE.Color(0x222222); 
                //child.material.emissiveIntensity = 0.6;
                child.material.onBeforeCompile = this.treeShader.inject;

                const instancedMesh = InstancedMeshFactory.create(child, matrices);
                this.sceneController.add(instancedMesh);
            }
        });
    }
}