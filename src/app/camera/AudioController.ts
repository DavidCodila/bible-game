import * as THREE from 'three';
import type { DisposableObject } from '../types';

export class AudioController implements DisposableObject {
    private readonly audioListener: THREE.AudioListener;
    private readonly audioLoader: THREE.AudioLoader;
    private backgroundMusic?: THREE.Audio;

    constructor(audioListener: THREE.AudioListener) {
        this.audioListener = audioListener;
        this.audioLoader = new THREE.AudioLoader();
        
        this.setupUserInteractionHandler();
    }

    private setupUserInteractionHandler(): void {
        const startAudio = () => {
            if (this.audioListener.context.state === 'suspended') {
                this.audioListener.context.resume();
            }
            
            if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
                this.backgroundMusic.play();
            }

            window.removeEventListener('click', startAudio);
        };

        window.addEventListener('click', startAudio);
    }

    public loadBackgroundMusic(url: string, volume: number = 0.3): void {
        this.audioLoader.load(
            url, 
            (buffer) => {
                this.backgroundMusic = new THREE.Audio(this.audioListener);
                this.backgroundMusic.setBuffer(buffer);
                this.backgroundMusic.setLoop(true);
                this.backgroundMusic.setVolume(volume);
                if (this.audioListener.context.state === 'running') {
                    this.backgroundMusic.play();
                }
            },
            // Progress callback (required for load method)
            undefined,
            (error) => {
                console.error(`An error occurred loading the audio file at ${url}:`, error);
            }
        );
    }

    public dispose(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic.disconnect();
        }
    }
}