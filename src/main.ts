import { GardenOfEdenApp } from './app/GardenOfEdenApp';

const initialiseApplication = (): void => {
  new GardenOfEdenApp();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialiseApplication);
} else {
  initialiseApplication();
}