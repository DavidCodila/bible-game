import { WindowController } from '@src/app/WindowController';
import { RendererController } from '@src/app/RendererController';
import { CameraController } from '@src/app/camera/CameraController';

describe('WindowController', () => {
    let mockRendererController: RendererController;
    let mockCameraController: CameraController;
    let windowController: WindowController;

    beforeEach(() => {
        mockRendererController = {
            resizeWindow: vi.fn()
        } as unknown as RendererController;

        mockCameraController = {
            resizeWindow: vi.fn()
        } as unknown as CameraController;

        vi.spyOn(window, 'addEventListener');
        vi.spyOn(window, 'removeEventListener');
        vi.spyOn(console, 'log').mockImplementation(() => {});

        windowController = new WindowController(mockRendererController, mockCameraController);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Lifecycle and Events', () => {
        it('should register the resize listener on initialization', () => {
            expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
        });

        it('should trigger updates when the window is resized', () => {
            window.dispatchEvent(new Event('resize'));

            expect(mockRendererController.resizeWindow).toHaveBeenCalledTimes(1);
            expect(mockCameraController.resizeWindow).toHaveBeenCalledTimes(1);
        });
    });

    describe('Disposal', () => {
        it('should perform the disposal protocol (unregister listener and log)', () => {
            windowController.dispose();

            expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
            expect(console.log).toHaveBeenCalledWith('WindowController released');
        });

        it('should validate that resizes are not called after the dispose', () => {
            windowController.dispose();

            window.dispatchEvent(new Event('resize'));
            
            expect(mockRendererController.resizeWindow).not.toHaveBeenCalled();
            expect(mockCameraController.resizeWindow).not.toHaveBeenCalled();
        });
    });
});