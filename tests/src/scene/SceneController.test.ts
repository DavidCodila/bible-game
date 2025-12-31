// @vitest-environment node
import * as THREE from 'three';
import { SceneController } from '@src/scene/SceneController';

describe('SceneController', () => {
    let scene: THREE.Scene;
    let sceneController: SceneController;

    beforeEach(() => {
        scene = new THREE.Scene();
        sceneController = new SceneController(scene);
    });

    describe('Initialization', () => {
        it('should apply the sky-blue background color immediately upon construction', () => {
            const backgroundValue = scene.background;
            
            expect(backgroundValue).toBeInstanceOf(THREE.Color);
            
            if (backgroundValue instanceof THREE.Color) {
                expect(backgroundValue.getHex()).toBe(0x87ceeb);
            }
        });
    });

    describe('Scene Object Addition', () => {
        it('should correctly proxy multiple objects to the underlying scene', () => {
            const firstBox = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
            const secondBox = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
            
            sceneController.add(firstBox, secondBox);
            
            expect(scene.children.length).toBe(2);
            expect(scene.children).toContain(firstBox);
            expect(scene.children).toContain(secondBox);
        });
    });

    describe('State Exposure', () => {
        it('should return a functional scene instance that reflects controller state', () => {
            const retrievedSceneInstance = sceneController.sceneInstance;

            expect(retrievedSceneInstance).toBeInstanceOf(THREE.Scene);
            expect(retrievedSceneInstance).toBe(scene);

            const perspectiveMesh = new THREE.Mesh();
            sceneController.add(perspectiveMesh);

            expect(retrievedSceneInstance.children).toContain(perspectiveMesh);
        });
    })

    describe('Lifecycle and Disposal', () => {
        it('should reset the scene state to prevent memory leaks or ghosting', () => {
            sceneController.add(new THREE.Object3D());
            
            const clearSpy = vi.spyOn(scene, 'clear');
            
            sceneController.dispose();

            expect(scene.background).toBeNull();

            expect(clearSpy).toHaveBeenCalled();
            expect(scene.children.length).toBe(0);
        });

        it('should be safe to call dispose multiple times (Idempotency)', () => {
            expect(() => {
                sceneController.dispose();
                sceneController.dispose();
            }).not.toThrow();
        });
    });
});