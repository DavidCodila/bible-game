// src/ui/debug/WindDebugUI.ts

import { WindService } from '../../world/wind/WindService';
import { NoiseGenerator } from '../../world/grass/Noise';

export class WindDebugUI {
  private panel: HTMLElement | null = null;
  private windService: WindService;

  constructor(windService: WindService) {
    this.windService = windService;
    this.initPanel();
    this.setupListeners();
    this.updateDisplay();
  }

  private initPanel() {
    this.panel = document.getElementById('wind-debug-panel');
    if (!this.panel) {
      console.error("Wind debug panel not found in DOM");
      return;
    }
  }

  private setupListeners() {
    if (!this.panel) return;

    const sliders = {
      speed: this.panel.querySelector('#slider-speed') as HTMLInputElement,
      freq: this.panel.querySelector('#slider-freq') as HTMLInputElement,
      scale: this.panel.querySelector('#slider-scale') as HTMLInputElement,
      octaves: this.panel.querySelector('#slider-octaves') as HTMLInputElement,
      persist: this.panel.querySelector('#slider-persist') as HTMLInputElement,
      lac: this.panel.querySelector('#slider-lac') as HTMLInputElement,
    };

    const values = {
      speed: this.panel.querySelector('#val-speed') as HTMLElement,
      freq: this.panel.querySelector('#val-freq') as HTMLElement,
      scale: this.panel.querySelector('#val-scale') as HTMLElement,
      octaves: this.panel.querySelector('#val-octaves') as HTMLElement,
      persist: this.panel.querySelector('#val-persist') as HTMLElement,
      lac: this.panel.querySelector('#val-lac') as HTMLElement,
    };

    sliders.speed.oninput = () => {
      this.windService.uniforms.uWindSpeed.value = parseFloat(sliders.speed.value);
      values.speed.textContent = sliders.speed.value;
    };

    sliders.freq.oninput = () => {
      this.windService.uniforms.uWindFrequency.value = parseFloat(sliders.freq.value);
      values.freq.textContent = sliders.freq.value;
    };

    const regenerate = () => {
      const newTex = NoiseGenerator.createSeamlessNoise(
        256,
        parseInt(sliders.octaves.value),
        parseFloat(sliders.persist.value),
        parseFloat(sliders.lac.value),
        parseFloat(sliders.scale.value)
      );
      this.windService.uniforms.uWindNoiseTexture.value = newTex;
      values.scale.textContent = sliders.scale.value;
      values.octaves.textContent = sliders.octaves.value;
      values.persist.textContent = sliders.persist.value;
      values.lac.textContent = sliders.lac.value;
    };

    sliders.scale.oninput = regenerate;
    sliders.octaves.oninput = regenerate;
    sliders.persist.oninput = regenerate;
    sliders.lac.oninput = regenerate;

    // Initial sync
    sliders.speed.value = this.windService.uniforms.uWindSpeed.value.toString();
    sliders.freq.value = this.windService.uniforms.uWindFrequency.value.toString();
    sliders.scale.value = "0.8";
    sliders.octaves.value = "5";
    sliders.persist.value = "0.48";
    sliders.lac.value = "2.3";
  }

  private updateDisplay() {
    if (!this.panel) return;
    // Optional: re-sync display if needed
  }

  public toggle() {
    if (this.panel) {
      this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
    }
  }
}