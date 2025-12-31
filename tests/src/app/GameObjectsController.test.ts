import * as THREE from 'three';
import { GameObjectsController } from '@src/app/GameObjectsController';
import type { MeshGameObject } from '@src/app/types';
import { SceneController } from '@src/scene/SceneController';

vi.mock('@src/scene/SceneController');

describe('GameObjectsController', () => {
    let sceneInstance: THREE.Scene;
    let mockedSceneController: SceneController; 
    let gameObjectsController: GameObjectsController;
    let gameObject: MeshGameObject;

    function createMockGameObject(): MeshGameObject {
        return {
            mesh: new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()),
            update: vi.fn(),
            dispose: vi.fn()
        };
    }

    beforeEach(() => {
        sceneInstance = new THREE.Scene();

        mockedSceneController = new SceneController(sceneInstance);

        Object.defineProperty(mockedSceneController, 'sceneInstance', {
            get: () => sceneInstance,
            configurable: true
        });

        gameObjectsController = new GameObjectsController(mockedSceneController);
        gameObject = createMockGameObject();
        gameObjectsController.add(gameObject);
    });

    afterEach(() => {
        gameObjectsController.dispose();
        vi.clearAllMocks();
    });

    describe('Frame Update Logic', () => {
        it('should propagate the delta time to all registered game objects', () => {
            const gameObject2 = createMockGameObject();
            const deltaTime = 0.016;

            gameObjectsController.add(gameObject2);
            
            gameObjectsController.update(deltaTime);

            expect(gameObject.update).toHaveBeenCalledWith(deltaTime);
            expect(gameObject2.update).toHaveBeenCalledWith(deltaTime);
        });
    });

    describe('Cleanup and Responsibility', () => {
        it('should dispose objects but leave scene clearing to the SceneController', () => {
            gameObjectsController.dispose();

            expect(gameObject.dispose).toHaveBeenCalledTimes(1);
        });

        it('should empty the internal registry after disposal to prevent memory leaks', () => {
            gameObjectsController.dispose();

            expect(gameObjectsController.gameObjects).toHaveLength(0);
        });
    });
});