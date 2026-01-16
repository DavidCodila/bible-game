import type { SceneController } from "../scene/SceneController";
import type { DisposableObject, MeshGameObject } from './types';

export class GameObjectsController implements DisposableObject {
    sceneController: SceneController;
    gameObjects: MeshGameObject[];

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gameObjects = [];
    }

    public add(...meshGameObjects: MeshGameObject[]): void {
        this.gameObjects.push(...meshGameObjects);
        const meshesToRegister = meshGameObjects.map((gameObject) => gameObject.mesh);
        this.sceneController.add(...meshesToRegister);
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