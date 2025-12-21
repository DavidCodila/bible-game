import { GardenOfEdenApp } from './app/GardenOfEdenApp.ts';

const initaliseApplication = () => {
  new GardenOfEdenApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initaliseApplication);
} else {
  initaliseApplication();
}