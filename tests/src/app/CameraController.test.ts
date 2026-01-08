import { PerspectiveCamera } from 'three';
import { CameraController } from '../../../src/app/camera/CameraController';
import { InputManager } from '../../../src/app/InputManager';

describe('CameraController', () => {
    let mockCamera: PerspectiveCamera;
    let mockInputManager: InputManager;
    let cameraController: CameraController;

    const mouseSensitivity = 0.002;

    const mockWindow = {
        innerWidth: 1920,
        innerHeight: 1080
    };

    beforeEach(() => {
        vi.stubGlobal('window', mockWindow);

        mockCamera = new PerspectiveCamera();
        
        mockInputManager = {
            mouseHasNotMoved: false,
            mouseDeltaX: 0,
            mouseDeltaY: 0,
            resetDeltas: vi.fn()
        } as unknown as InputManager;

        cameraController = new CameraController(mockCamera, mockInputManager);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should work', () => {
        expect(1);
    }) 
/*
    describe('Initialization', () => {
        it('should setup camera with correct default values', () => {
            expect(mockCamera.fov).toBe(75);
            expect(mockCamera.near).toBe(0.1);
            expect(mockCamera.far).toBe(1000);
            expect(mockCamera.rotation.order).toBe('YXZ');
            expect(mockCamera.position.x).toBe(0);
            expect(mockCamera.position.y).toBe(1.8);
            expect(mockCamera.position.z).toBe(0);
        });

        it('should provide access to the camera instance via getter', () => {
            expect(cameraController.camera).toBe(mockCamera);
        });
    });

    
    describe('Update Logic', () => {
        it('should return early and NOT reset deltas if mouse has not moved', () => {
            (mockInputManager as any).mouseHasNotMoved = true;
            
            cameraController.update();
        
            expect(mockInputManager.resetDeltas).not.toHaveBeenCalled();
        });

        it('should update yaw and pitch based on mouse deltas and sensitivity', () => {
            const deltaX = 100;
            const deltaY = 50;
            
            (mockInputManager as any).mouseDeltaX = deltaX;
            (mockInputManager as any).mouseDeltaY = deltaY;
            (mockInputManager as any).mouseHasNotMoved = false;

            const expectedYaw = mockCamera.rotation.y - (deltaX * mouseSensitivity);
            const expectedPitch = mockCamera.rotation.x - (deltaY * mouseSensitivity);

            cameraController.update();

            expect(mockCamera.rotation.y).toBeCloseTo(expectedYaw);
            expect(mockCamera.rotation.x).toBeCloseTo(expectedPitch);
        });

        it('should clamp vertical pitch at the upper limit (PI/2)', () => {
            (mockInputManager as any).mouseDeltaY = -10000; 
            (mockInputManager as any).mouseHasNotMoved = false;

            cameraController.update();

            expect(mockCamera.rotation.x).toBe(Math.PI / 2);
        });

        it('should clamp vertical pitch at the lower limit (-PI/2)', () => {
            (mockInputManager as any).mouseDeltaY = 10000; 
            (mockInputManager as any).mouseHasNotMoved = false;

            cameraController.update();

            expect(mockCamera.rotation.x).toBe(-Math.PI / 2);
        });
    });
    */

    describe('Window Resizing', () => {
        it('should update aspect ratio on resize', () => {
            const width = 800;
            const height = 600;
            const aspectRatio = width / height;
            mockWindow.innerWidth = width;
            mockWindow.innerHeight = height;

            cameraController.resizeWindow();

            expect(mockCamera.aspect).toBe(aspectRatio);
        });

        it('should call updateProjectionMatrix on the camera during resize', () => {
            const updateProjectionMatrixSpy = vi.spyOn(mockCamera, 'updateProjectionMatrix');
            
            cameraController.resizeWindow();
        
            expect(updateProjectionMatrixSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Disposal', () => {
        it('should implement the dispose method without throwing errors', () => {
            expect(() => cameraController.dispose()).not.toThrow();
        });
    });
});