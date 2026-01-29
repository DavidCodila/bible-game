import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TerrainHeightService } from '../terrain/services/TerrainHeightService';
import type { SceneController } from '../scene/SceneController';
import { WORLD_SIZE } from '../terrain/Constants';

export class TreeManager {
    private loader = new GLTFLoader();
    private sceneController: SceneController;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
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

                const material = child.material as THREE.MeshStandardMaterial;
                if (material.map) {
                    material.alphaTest = 0.5;      // Only render pixels stronger than 50% opacity
                    material.transparent = false; // TURNING THIS OFF SAVES PERFORMANCE
                    material.side = THREE.DoubleSide; 
                    material.needsUpdate = true;
                }

                const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const instancedMesh = new THREE.InstancedMesh(child.geometry, testMaterial, count);     


                /*
                const instancedMesh = new THREE.InstancedMesh(
                    child.geometry,
                    child.material,
                    count
                );
                */

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
        const x = (Math.random() - 0.5) * WORLD_SIZE;
        const z = (Math.random() - 0.5) * WORLD_SIZE;
        const y = TerrainHeightService.getHeight(x, z);

        dummy.position.set(x, y, z); // Use the random X and Z!
        dummy.rotation.y = Math.random() * Math.PI * 2;
        const scale = 0.4;
        dummy.scale.set(scale, scale, scale);
    }
}