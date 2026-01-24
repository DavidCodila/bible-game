import { SystemsRegistry } from "../../../src/engine/SystemsRegistry";
import { UPDATE_ORDER, DISPOSE_ORDER, ALL_KEYS } from "../../../src/engine/AppConfig";
import { buildWorld } from "../../../src/world/logic/WorldBuilder"; 

vi.mock('../../../src/app/WorldBuilder', () => ({
    buildWorld: vi.fn()
}));

vi.mock('three/examples/jsm/libs/stats.module.js', () => {
    class MockStats {
        public dom = document.createElement('div');
        public showPanel = vi.fn();
        public begin = vi.fn();
        public end = vi.fn();
        public update = vi.fn();
    }

    return {
        default: MockStats
    };
});

describe('SystemsRegistry', () => {
    const createMockSystems = () => {
        const systems: Record<string, any> = {};
        ALL_KEYS.forEach(key => {
            systems[key] = {
                update: vi.fn(),
                dispose: vi.fn(),
                render: vi.fn(),
                sceneInstance: {},
                cameraInstance: {}
            };
        });
        return systems;
    };

    test('update() calls all systems in the EXACT order defined in UPDATE_ORDER', () => {
        const systems = createMockSystems();
        const registry = new SystemsRegistry(systems);
        const executionOrder: string[] = [];

        UPDATE_ORDER.forEach(key => {
            systems[key].update.mockImplementation(() => executionOrder.push(key));
        });

        registry.update(0.016);
        expect(executionOrder).toEqual([...UPDATE_ORDER]);
    });

    test('dispose() calls all systems in the EXACT order defined in DISPOSE_ORDER', () => {
        const systems = createMockSystems();
        const registry = new SystemsRegistry(systems);
        const executionOrder: string[] = [];

        DISPOSE_ORDER.forEach(key => {
            systems[key].dispose.mockImplementation(() => executionOrder.push(key));
        });

        registry.dispose();
        expect(executionOrder).toEqual([...DISPOSE_ORDER]);
    });

    test('render() delegates to rendererController with scene and camera instances', () => {
        const systems = createMockSystems();
        const registry = new SystemsRegistry(systems);

        registry.render();

        expect(systems.rendererController.render).toHaveBeenCalledWith(
            systems.sceneController.sceneInstance,
            systems.cameraController.camera
        );
    });

    test('buildWorld() passes gameObjectsController to the WorldBuilder utility', () => {
        const systems = createMockSystems();
        const registry = new SystemsRegistry(systems);

        registry.buildWorld();

        expect(buildWorld).toHaveBeenCalledWith(systems.gameObjectsController);
    });
});