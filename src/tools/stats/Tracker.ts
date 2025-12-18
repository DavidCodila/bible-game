import { STATS_CONFIG } from "./Constants";
import type { PerformanceMetrics } from "./Types";

export class StatsTracker {
    private metrics: PerformanceMetrics;

    constructor() {
        this.metrics = {
            frameStartTime: performance.now(),
            frameTimeHistory: [],
            avgFrameTime: 0,
            avgFPS: 0,
            lastLogTime: performance.now(),
        };
    }

    public update(): void {
        const currentTime = performance.now();
        const frameDuration = currentTime - this.metrics.frameStartTime;
        this.metrics.frameStartTime = currentTime;

        if (frameDuration > 0 && frameDuration < 100) {
            this.updateHistory(frameDuration);
        }
        this.logPeriodically(currentTime);
    }

    private updateHistory(duration: number): void {
        const history = this.metrics.frameTimeHistory;
        history.push(duration);
        if (history.length > STATS_CONFIG.HISTORY_CAPACITY) {
            history.shift();
        }

        const totalTime = history.reduce((sum, time) => sum + time, 0);
        this.metrics.avgFrameTime = totalTime / history.length;
        this.metrics.avgFPS = STATS_CONFIG.ONE_SECOND_IN_MILLISECONDS / this.metrics.avgFrameTime;
    }

    private logPeriodically(currentTime: number): void {
        const logInterval = STATS_CONFIG.LOG_INTERVAL_IN_MILLISECONDS;
        if (currentTime >= this.metrics.lastLogTime + logInterval) {
            console.log(`FPS: ${this.metrics.avgFPS.toFixed(1)} | Time: ${this.metrics.avgFrameTime.toFixed(2)}ms`);
            this.metrics.lastLogTime = currentTime;
        }
    }
}