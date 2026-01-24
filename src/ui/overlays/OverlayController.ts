import { TransitionController } from "../transition/TransitionController";

export class OverlayController {
    private static menuMusic = new Audio();

    public static init(onUserReady: () => void): void {
        // Force the path to absolute root
        this.menuMusic.src = '/audio/valley-of-eden.mp3';
        this.menuMusic.preload = 'auto';

        const splash = document.getElementById('splash-prompt');
        const mainMenu = document.getElementById('main-menu');
        const startButton = document.getElementById('start-button');

        const handleWakeUp = () => {
            console.log("Attempting to play menu music from:", this.menuMusic.src);
            
            this.menuMusic.loop = true;
            this.menuMusic.volume = 0;
            
            this.menuMusic.play()
                .then(() => {
                    console.log("Menu music playing successfully.");
                    this.fadeAudio(this.menuMusic, 0.5, 2000);
                })
                .catch(error => {
                    // This will tell us if the file is missing (404) or blocked
                    console.error("Menu Audio Error Detail:", error.message);
                    console.error("Current src path being used:", this.menuMusic.currentSrc);
                });

            if (splash) splash.style.display = 'none';
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.classList.add('fade-in');
                mainMenu.style.display = 'flex';
            }

            window.removeEventListener('mousedown', handleWakeUp);
        };

        window.addEventListener('mousedown', handleWakeUp);

        startButton?.addEventListener('click', (event) => {
            event.stopPropagation();
            onUserReady();
        });
    }

    public static startFadeSequence(onComplete?: () => void): void {
        const overlayElement = document.getElementById('start-page');
        if (!overlayElement) return;

        this.fadeAudio(this.menuMusic, 0, 1500);

        overlayElement.style.opacity = '0';
        overlayElement.style.pointerEvents = 'none';
        
        TransitionController.getInstance().activate();

        if (onComplete) onComplete();

        setTimeout(() => {
            overlayElement.remove();
            document.querySelector('canvas')?.requestPointerLock();
        }, 2000);
    }

    private static fadeAudio(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
        const startVolume = audio.volume;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            audio.volume = startVolume + (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (targetVolume === 0) {
                audio.pause();
            }
        };
        requestAnimationFrame(animate);
    }
}