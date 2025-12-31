import { RendererController } from './RendererController';
import { CameraController } from './CameraController';
import type { DisposableObject } from './types';

export class WindowController implements DisposableObject {
    private rendererController: RendererController;
    private cameraController: CameraController;

    constructor(rendererController: RendererController, cameraController: CameraController) {
        this.rendererController = rendererController;
        this.cameraController = cameraController;
        
        this.initialiseListerners();
    }

    private initialiseListerners(): void {
        window.addEventListener('resize', this.handleResize);
    }

    private handleResize = (): void => {
        this.rendererController.resizeWindow();
        this.cameraController.resizeWindow();
    }

    public dispose(): void {
        window.removeEventListener('resize', this.handleResize);
        console.log('WindowController released');
    }
}