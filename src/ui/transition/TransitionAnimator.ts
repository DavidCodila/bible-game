import * as THREE from 'three';

export class TransitionAnimator {
    public static start(
        material: THREE.ShaderMaterial, 
        onComplete: () => void
    ): void {
        const startTime = performance.now();
        const duration: number = 8000; 

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            material.uniforms.uProgress.value = progress;

            if (progress < 1.0) {
                requestAnimationFrame(step);
            } else {
                onComplete();
            }
        };

        requestAnimationFrame(step);
    }
}