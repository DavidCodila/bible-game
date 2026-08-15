import type { SceneController } from "../scene/SceneController";
import type { DisposableObject, MeshGameObject } from '../../types/engine';
import * as THREE from 'three';


export class GameObjectsController implements DisposableObject {
    sceneController: SceneController;
    gameObjects: MeshGameObject[];
    meshCount: number;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gameObjects = [];
        this.meshCount = 0;
    }

    public add(...meshGameObjects: MeshGameObject[]): void {
        this.gameObjects.push(...meshGameObjects);
        const meshesToRegister = meshGameObjects.map((gameObject) => gameObject.mesh);
        this.sceneController.add(...meshesToRegister);
        let newInstancedCount = 0;
        meshesToRegister.forEach(mesh => {
        if (mesh instanceof THREE.InstancedMesh) {
            newInstancedCount++;
        }
        });

    this.meshCount += newInstancedCount;

    console.log(
        `Added ${meshGameObjects.length} game objects → ` +
        `${newInstancedCount} new InstancedMeshes → ` +
        `total tracked InstancedMeshes: ${this.meshCount}`
    );
    }

    public remove(...meshGameObjects: MeshGameObject[]): void {
        const meshesToRemove = meshGameObjects.map(obj => obj.mesh);
        this.sceneController.remove(...meshesToRemove);

        this.gameObjects = this.gameObjects.filter(
            obj => !meshGameObjects.includes(obj)
        );
    }

    public update(elapsedTime: number): void {
        for (const gameObject of this.gameObjects) {
            gameObject.update(elapsedTime);
        }
    }

    public dispose(): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.dispose();
        });
        this.gameObjects = [];
    }
}