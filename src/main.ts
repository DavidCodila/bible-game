import { GardenOfEdenApp } from './app/GardenOfEdenApp';
import { OverlayController } from '../src/app/OverlayController';

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