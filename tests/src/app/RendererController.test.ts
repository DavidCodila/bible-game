import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { RendererController } from '@src/app/RendererController';

describe('RendererController', () => {
    let mockRenderer: WebGLRenderer;
    let mockCanvas: HTMLCanvasElement;
    let rendererController: RendererController;
    const devicePixelRatio = 2;

    const mockWindow = {
        innerWidth: 1920,
        innerHeight: 1080,
        devicePixelRatio: devicePixelRatio
    };

    const mockBody = {
        appendChild: vi.fn(),
    };

    beforeEach(() => {
        vi.stubGlobal('window', mockWindow);
        vi.stubGlobal('document', { body: mockBody });

        mockCanvas = {
            parentNode: {
                removeChild: vi.fn(),
            },
        } as unknown as HTMLCanvasElement;

        mockRenderer = {
            render: vi.fn(),
            setSize: vi.fn(),
            setPixelRatio: vi.fn(),
            dispose: vi.fn(),
            forceContextLoss: vi.fn(),
            domElement: mockCanvas,
        } as unknown as WebGLRenderer;

        rendererController = new RendererController(mockRenderer);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with the window dimensions and pixel ratio', () => {
            expect(mockRenderer.setSize).toHaveBeenCalledWith(1920, 1080);
            expect(mockRenderer.setPixelRatio).toHaveBeenCalledWith(devicePixelRatio);
        });

        it('should append the renderer canvas to the document body', () => {
            expect(mockBody.appendChild).toHaveBeenCalledWith(mockCanvas);
        });
    });

    describe('Functionality', () => {
        it('should trigger the internal renderer to draw the scene', () => {
            const camera = new PerspectiveCamera();
            const scene = new Scene();
            
            rendererController.render(scene, camera);

            expect(mockRenderer.render).toHaveBeenCalledWith(scene, camera);
        });

        it('should update the renderer size when resizeWindow is called', () => {
            const newWidth = 800;
            const newHeight = 600;
            mockWindow.innerWidth = newWidth;
            mockWindow.innerHeight = newHeight;

            rendererController.resizeWindow();

            expect(mockRenderer.setSize).toHaveBeenCalledWith(newWidth, newHeight);
        });

        it('should return the renderer domElement', () => {
            expect(rendererController.instanceDomElement).toBe(mockCanvas);
        });
    });

    describe('Cleanup', () => {
        it('should release GPU resources and remove the element from the DOM', () => {
            rendererController.dispose();
    
            expect(mockRenderer.dispose).toHaveBeenCalled();
            expect(mockRenderer.forceContextLoss).toHaveBeenCalled();
            expect(mockCanvas.parentNode?.removeChild).toHaveBeenCalledWith(mockCanvas);
        });
    
        it('should not attempt to remove the canvas if parentNode is missing', () => {
            (mockRenderer.domElement as any).parentNode = null;
    
            rendererController.dispose();
    
            expect(mockRenderer.dispose).toHaveBeenCalled();
        });
    
        it('should not attempt to remove the canvas if domElement is missing', () => {
            (mockRenderer as any).domElement = null;
    
            rendererController.dispose();
    
            expect(mockRenderer.dispose).toHaveBeenCalled();
        });
    });
});