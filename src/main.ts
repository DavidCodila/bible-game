import { GardenOfEdenApp } from './app/GardenOfEdenApp';

const initialiseApplication = (): void => {
    const app = new GardenOfEdenApp();

    const startButton = document.getElementById('start-button');
    
    if (startButton) {
        startButton.addEventListener('click', () => {
          app.play(); 
        });
    } else {
      console.error("Could not find start-button in the HTML");
    }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialiseApplication);
} else {
  initialiseApplication();
}