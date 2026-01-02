import type { SceneController } from "@src/scene/SceneController";
import type { DisposableObject, MeshGameObject } from './types';

export class GameObjectsController implements DisposableObject {
    sceneController: SceneController;
    gameObjects: MeshGameObject[];
    private readonly frustum: THREE.Frustum;
    private readonly projectionMatrix: THREE.Matrix4;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gameObjects = [];
        this.frustum = new THREE.Frustum();
        this.projectionMatrix = new THREE.Matrix4();
    }

    public add(...meshGameObjects: MeshGameObject[]): void {
        this.gameObjects.push(...meshGameObjects);
        const meshesToRegister = meshGameObjects.map((gameObject) => gameObject.mesh);
        this.sceneController.add(...meshesToRegister);
    }

    public update(deltaTime: number, camera: THREE.PerspectiveCamera): void {
        this.projectionMatrix.multiplyMatrices(
            camera.projectionMatrix, 
            camera.matrixWorldInverse
        );
        
        this.frustum.setFromProjectionMatrix(this.projectionMatrix);
        
        let visibleCount = 0;
        
        this.gameObjects.forEach((gameObject) => {
            const mesh = gameObject.mesh;
            
            mesh.visible = this.frustum.intersectsObject(mesh);
        
            if (mesh.visible) {
                visibleCount++;
                gameObject.update(deltaTime);
            }
        });
        if (Math.random() > 0.9) {console.log("Visiable objects: " + visibleCount + " out of " + this.gameObjects.length)}
    }

    public dispose(): void {
        this.gameObjects.forEach(gameObject => {
            gameObject.dispose();
        });
        this.gameObjects = [];
    }
}