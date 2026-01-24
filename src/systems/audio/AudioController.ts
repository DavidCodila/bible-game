import * as THREE from 'three';
import type { DisposableObject } from '../../types/engine';

export class AudioController implements DisposableObject {
    private readonly audioListener: THREE.AudioListener;
    private readonly audioLoader: THREE.AudioLoader;
    private backgroundMusic?: THREE.Audio;

    constructor(audioListener: THREE.AudioListener) {
        this.audioListener = audioListener;
        this.audioLoader = new THREE.AudioLoader();
    }

    public async loadBackgroundMusic(url: string, volume: number = 0.3): Promise<void> {
        return new Promise((resolve, reject) => {
            this.audioLoader.load(
                url, 
                (buffer) => {
                    this.backgroundMusic = new THREE.Audio(this.audioListener);
                    this.backgroundMusic.setBuffer(buffer);
                    this.backgroundMusic.setLoop(true);
                    this.backgroundMusic.setVolume(volume);
                    resolve(); // Signal that loading is complete
                },
                undefined,
                (error) => {
                    console.error(`An error occurred loading the audio file at ${url}:`, error);
                    reject(error);
                }
            );
        });
    }

    public play(): void {
        if (this.audioListener.context.state === 'suspended') {
            this.audioListener.context.resume();
        }
        
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
    }

    public dispose(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic.disconnect();
        }
    }
}