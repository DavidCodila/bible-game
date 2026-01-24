import { TransitionController } from "./TransitionController";

export class OverlayController {

    public static startFadeSequence(): void {
        const overlayElement = document.getElementById('ui-overlay');
        if (!overlayElement) return;

        overlayElement.style.transition = 'opacity 2s ease-out';
        overlayElement.style.opacity = '0';
        overlayElement.style.pointerEvents = 'none';
        TransitionController.getInstance().activate();
        OverlayController.removeAndLock(1500, () => {
            const canvas = document.querySelector('canvas');
            canvas?.requestPointerLock();
        });
    }

    private static removeAndLock(delayMilliseconds: number, onComplete: () => void): void {
        const overlayElement = document.getElementById('ui-overlay');
        setTimeout(() => {
            overlayElement?.remove();
            onComplete();
        }, delayMilliseconds);
    }
}