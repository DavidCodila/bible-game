import { assembleSystemsRegistry } from '../../../src/engine/factories/Factory';
import { SystemsRegistry } from '../../../src/engine/registry/SystemsRegistry';
import { InputManager } from '../../../src/systems/input/InputManager';
import { GameObjectsController } from '../../../src/world/logic/GameObjectsController';
import { CameraController } from '../../../src/systems/camera/CameraController';
import { WindowController } from '../../../src/systems/window/WindowController';

// Mock THREE module with MockWebGLRenderer defined INSIDE the factory
vi.mock('three', async () => {
    const actual = await vi.importActual<typeof import('three')>('three');
    
    // Define mock class inside the factory (this is hoisted-safe)
    class MockWebGLRenderer {
        domElement = document.createElement('canvas');
        shadowMap = { enabled: false, type: 1 };
        setSize = vi.fn();
        setPixelRatio = vi.fn();
        render = vi.fn();
        dispose = vi.fn();
        forceContextLoss = vi.fn();
    }
    
    return {
        ...actual,
        WebGLRenderer: MockWebGLRenderer,
    };
});

// Import THREE after the mock is set up
const THREE = await import('three');

// 1. Setup Spies with distinct return values so we can track them
vi.mock('../../../src/app/RendererController', () => ({
    RendererController: vi.fn().mockImplementation(function() {
        return { instanceDomElement: { id: 'unique-canvas-id' } };
    })
}));

vi.mock('../../../src/scene/SceneController', () => ({
    SceneController: vi.fn().mockImplementation(function(sceneInstance) {
        return { scene: sceneInstance };
    })
}));

vi.mock('../../../src/app/InputManager', () => ({
    InputManager: vi.fn().mockImplementation(function() {
        return { inputId: 'unique-input-id' };
    })
}));

vi.mock('../../../src/app/GameObjectsController', () => ({
    GameObjectsController: vi.fn().mockImplementation(function() { return {}; })
}));

vi.mock('../../../src/app/camera/CameraController', () => ({
    CameraController: vi.fn().mockImplementation(function() { return {cameraID: 'unique-camera-id'}; })
}));

vi.mock('../../../src/app/WindowController', () => ({
    WindowController: vi.fn().mockImplementation(function() { return {}; })
}));

vi.mock('../../../src/app/SystemsRegistry', () => {
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