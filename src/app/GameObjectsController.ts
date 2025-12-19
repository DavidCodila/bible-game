import type { SceneController } from '../scene/SceneController';
import type { GameObject } from './types';

export class GameObjectsController {
    sceneController: SceneController;
    gameObjects: GameObject[];

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gameObjects = [];
    }

    public add(gameObject: GameObject): void {
        this.gameObjects.push(gameObject);
        this.sceneController.add(gameObject.mesh);
    }

    public update(deltaTime: number): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime);
        });
    }


}