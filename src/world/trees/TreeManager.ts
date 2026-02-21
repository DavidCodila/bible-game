import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TerrainHeightService } from '../terrain/services/TerrainHeightService';
import { CreditsManager } from '../../utils/CreditsManager';
import type { SceneController } from '../scene/SceneController';
import { WORLD_SIZE_METERS } from '../WorldConfig';

export class TreeManager {
    private loader = new GLTFLoader();
    private sceneController: SceneController;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
    }

    public async initialise() {
        this.spawnTrees('models/Pine_Tree_Large_LOD0_v1.glb', 1);
        this.spawnTrees('models/Pine_Tree_Small_LOD0_v2.glb', 5);
        this.spawnTrees('models/Pine_Tree_Small_LOD0_v3.glb', 5);
        this.spawnTrees('models/Pine_Tree_Small_LOD0_v3.glb', 5);
        this.registerAssets();
    }

    public async spawnTrees(modelPath: string, count: number): Promise<void> {
        // 1. Load the GLTF Model
        const gltf = await this.loader.loadAsync(modelPath);
        
        // 2. Pre-calculate Matrices (Position/Rotation/Scale) for all trees
        // We do this once so the trunk and leaves use the exact same transforms
        const matrices: THREE.Matrix4[] = [];
        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            this.randomizePositionOnTerrain(dummy);
            dummy.updateMatrix();
            matrices.push(dummy.matrix.clone());
        }

        // 3. Process every mesh inside the GLTF (Bark, Leaves, etc.)
        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                console.log(`Mesh: ${child.name} | Polys: ${child.geometry.attributes.position.count / 3}`);

                const instancedMesh = new THREE.InstancedMesh(
                    child.geometry,
                    child.material,
                    count
                );

                // Apply the pre-calculated matrices
                for (let i = 0; i < count; i++) {
                    instancedMesh.setMatrixAt(i, matrices[i]);
                }

                // Enable Shadows
                instancedMesh.castShadow = true;
                instancedMesh.receiveShadow = true;
                instancedMesh.instanceMatrix.needsUpdate = true;
                
                // Optimization: Don't let Three.js try to cull individual trees yet
                // (We will fix culling later)
                instancedMesh.frustumCulled = false;

                this.sceneController.add(instancedMesh);
            }
            else {
                console.log("tree: " + child + " did not process in gltf.scene.traverse"); 
            }
        });
    }

    private randomizePositionOnTerrain(dummy: THREE.Object3D): void {
        const x = (Math.random() - 0.5) * WORLD_SIZE_METERS;
        const z = (Math.random() - 0.5) * WORLD_SIZE_METERS;
        const y = TerrainHeightService.getHeight(x, z);

        dummy.position.set(x, y, z); // Use the random X and Z!
        dummy.rotation.y = Math.random() * Math.PI * 2;
    }

    public async registerAssets() {
        CreditsManager.registerAsset({
            assetName: "Pine trees pack (lowpoly, game ready, LODs)",
            authorName: "LOLIPOP",
            licenseType: "CC BY 4.0",
            sourceLink: "https://sketchfab.com/3d-models/pine-trees-pack-lowpoly-game-ready-lods-e1e9c07b8e2e445c943fec660beefba2"
        });
        CreditsManager.printToConsole();
    }
}