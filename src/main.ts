import { GardenOfEdenApp } from './engine/Engine';
import { OverlayController } from './ui/overlays/OverlayController';

const initialiseApplication = (): void => {
    const gardenApp = new GardenOfEdenApp();

    // Pass the play method as the callback for the OverlayController
    OverlayController.init(() => {
        gardenApp.play();
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseApplication);
} else {
    initialiseApplication();
}