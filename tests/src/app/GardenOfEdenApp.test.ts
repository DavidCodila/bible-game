import { GardenOfEdenApp } from "@src/app/GardenOfEdenApp";
import * as AppFactory from "@src/app/AppFactory";

// 1. Hoist the registry mock so it's ready before the mock factory runs
const { mockRegistryFunctions } = vi.hoisted(() => ({
    mockRegistryFunctions: {
        buildWorld: vi.fn(),
        update: vi.fn(),
        render: vi.fn(),
        dispose: vi.fn()
    }
}));

// 2. Mock the module path exactly as it is imported in GardenOfEdenApp
vi.mock('@src/app/AppFactory', () => ({
    assembleSystemsRegistry: vi.fn(() => mockRegistryFunctions)
}));

describe('GardenOfEdenApp', () => {
    const frameTime: number = 16;
    let app: GardenOfEdenApp;
    let addEventSpy: any;
    let removeEventSpy: any;

    beforeEach(() => {
        vi.useFakeTimers();

        // 3. Force the factory method to be a spy Vitest can track
        vi.spyOn(AppFactory, 'assembleSystemsRegistry').mockReturnValue(mockRegistryFunctions as any);
        
        addEventSpy = vi.spyOn(window, 'addEventListener');
        removeEventSpy = vi.spyOn(window, 'removeEventListener');
        
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            return setTimeout(callback, frameTime) as any;
        });
        
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
            clearTimeout(id as any);
        });

        app = new GardenOfEdenApp();
    });

    afterEach(() => {
        if (app) app.dispose();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should assemble the systems registry and build the world on start', () => {
        expect(AppFactory.assembleSystemsRegistry).toHaveBeenCalled();
        expect(mockRegistryFunctions.buildWorld).toHaveBeenCalled();
    });

    it('should start the animation loop and update registry with deltaTime', () => {
        const numberOfTotalFrames = 3;

        vi.advanceTimersByTime(frameTime); 
        vi.advanceTimersByTime(frameTime); 

        expect(mockRegistryFunctions.update).toHaveBeenCalledWith(expect.any(Number));
        expect(mockRegistryFunctions.update).toHaveBeenCalledTimes(numberOfTotalFrames);
        expect(mockRegistryFunctions.render).toHaveBeenCalledTimes(numberOfTotalFrames);
    });

    it('should handle the window beforeunload event', () => {
        expect(addEventSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should stop the loop and dispose the registry when app is disposed', () => {
        const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
        app.dispose();

        expect(mockRegistryFunctions.dispose).toHaveBeenCalled();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should remove the beforeunload listener on disposal', () => {
        app.dispose();
        expect(removeEventSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should stop the animation loop when isRunning is false', () => {
        const appAny = app as any;
        
        appAny.isRunning = false;
        
        mockRegistryFunctions.update.mockClear();
        mockRegistryFunctions.render.mockClear();
    
        appAny.animate();
    
        expect(mockRegistryFunctions.update).not.toHaveBeenCalled();
        expect(mockRegistryFunctions.render).not.toHaveBeenCalled();
    });
    
    it('should trigger dispose via the handleBeforeUnload event listener', async () => {
        const disposeSpy = vi.spyOn(app, 'dispose');
    
        window.dispatchEvent(new Event('beforeunload'));
    
        await Promise.resolve();
    
        expect(disposeSpy).toHaveBeenCalled();
    });
    
});