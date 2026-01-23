import { RendererController } from './RendererController';
import { TransitionController } from './TransitionController';
import { CameraController } from './camera/CameraController';
import type { DisposableObject } from './types';

export class WindowController implements DisposableObject {
    private rendererController: RendererController;
    private cameraController: CameraController;

    constructor(
        rendererController: RendererController, 
        cameraController: CameraController,
    ) {
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
        TransitionController.getInstance().onResize(window.innerWidth, window.innerHeight);    
    }

    public dispose(): void {
        window.removeEventListener('resize', this.handleResize);
        console.log('WindowController released');
    }
}