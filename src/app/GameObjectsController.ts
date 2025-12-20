import type { SceneController } from '../scene/SceneController';
import type { DisposableObject, MeshGameObject } from './types';

export class GameObjectsController implements DisposableObject {
    sceneController: SceneController;
    gameObjects: MeshGameObject[];

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gameObjects = [];
    }

    public add(gameObject: MeshGameObject): void {
        this.gameObjects.push(gameObject);
        this.sceneController.add(gameObject.mesh);
    }

    public update(deltaTime: number): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime);
        });
    }

    public dispose(): void {
        this.gameObjects.forEach(gameObjects => {
            gameObjects.dispose();
        });
    }
}