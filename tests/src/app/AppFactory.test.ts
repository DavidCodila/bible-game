import { assembleSystemsRegistry } from '@src/app/AppFactory';
import { SystemsRegistry } from '@src/app/SystemsRegistry';
import { InputManager } from '@src/app/InputManager';
import { GameObjectsController } from '@src/app/GameObjectsController';
import { CameraController } from '@src/app/camera/CameraController';
import { WindowController } from '@src/app/WindowController';

// 1. Setup Spies with distinct return values so we can track them
vi.mock('@src/app/RendererController', () => ({
    RendererController: vi.fn().mockImplementation(function() {
        return { instanceDomElement: { id: 'unique-canvas-id' } };
    })
}));

vi.mock('@src/scene/SceneController', () => ({
    SceneController: vi.fn().mockImplementation(function(sceneInstance) {
        return { scene: sceneInstance };
    })
}));

vi.mock('@src/app/InputManager', () => ({
    InputManager: vi.fn().mockImplementation(function() {
        return { inputId: 'unique-input-id' };
    })
}));

vi.mock('@src/app/GameObjectsController', () => ({
    GameObjectsController: vi.fn().mockImplementation(function() { return {}; })
}));

vi.mock('@src/app/camera/CameraController', () => ({
    CameraController: vi.fn().mockImplementation(function() { return {cameraID: 'unique-camera-id'}; })
}));

vi.mock('@src/app/WindowController', () => ({
    WindowController: vi.fn().mockImplementation(function() { return {}; })
}));

vi.mock('@src/app/SystemsRegistry', () => {
    class MockSystemsRegistry {
        public buildWorld = vi.fn();
        public update = vi.fn();
        public render = vi.fn();
        public dispose = vi.fn();
    }

    return {
        SystemsRegistry: MockSystemsRegistry
    };
});

describe('AppFactory - assembleSystemsRegistry', () => {

    test('should verify GameObjectsController receives the SceneController which contains the THREE scene', () => {
        assembleSystemsRegistry();

        expect(GameObjectsController).toHaveBeenCalledWith(
            expect.objectContaining({
                scene: expect.any(THREE.Scene) 
            })
        );
    });

    test('should verify CameraController was invoked with the THREE Camera and InputManager instances', () => {
        assembleSystemsRegistry();

        // Verifying the injection of the THREE camera instance and our InputManager instance
        expect(CameraController).toHaveBeenCalledWith(
            expect.any(THREE.PerspectiveCamera),
            expect.objectContaining({ inputId: 'unique-input-id' })
        );
    });

    test('should verify InputManager was invoked with the Renderer DOM element', () => {
        assembleSystemsRegistry();

        expect(InputManager).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'unique-canvas-id' })
        );
    });

    test('should verify WindowController was invoked with Renderer and Camera controllers', () => {
        assembleSystemsRegistry();

        expect(WindowController).toHaveBeenCalledWith(
            expect.objectContaining({ instanceDomElement: { id: 'unique-canvas-id' } }),
            expect.objectContaining({cameraID: 'unique-camera-id'})
        );
    });

    test('should return an instance of SystemsRegistry', () => {
        const result = assembleSystemsRegistry();
        expect(result).toBeInstanceOf(SystemsRegistry);
    });
});