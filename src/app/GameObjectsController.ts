import type { SceneController } from "@src/scene/SceneController";
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

    public update(deltaTime: number): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime);
        });
    }

    public dispose(): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.dispose();
        });
        this.gameObjects = [];
    }
}