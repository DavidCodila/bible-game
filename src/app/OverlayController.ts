import { TransitionController } from "./transition/TransitionController";

export class OverlayController {

    public static startFadeSequence(): void {
        const overlayElement = document.getElementById('start-page');
        if (!overlayElement) return;

        overlayElement.style.transition = 'opacity 2s ease-out';
        overlayElement.style.opacity = '0';
        overlayElement.style.pointerEvents = 'none';
        TransitionController.getInstance().activate();
        OverlayController.removeAndLock(2000, () => {
            const canvas = document.querySelector('canvas');
            canvas?.requestPointerLock();
        });
    }

    private static removeAndLock(delayMilliseconds: number, onComplete: () => void): void {
        const overlayElement = document.getElementById('start-page');
        setTimeout(() => {
            overlayElement?.remove();
            onComplete();
        }, delayMilliseconds);
    }
}