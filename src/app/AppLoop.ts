export class AppLoop {
    private animationFrameId: number = 0;
    private isRunning: boolean = false;

    public start(tickCallback: () => void): void {
        if (this.isRunning) return;
        this.isRunning = true;

        const animate = () => {
            if (!this.isRunning) return;
            
            this.animationFrameId = requestAnimationFrame(animate);
            tickCallback();
        };

        animate();
    }

    public stop(): void {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
    }
}