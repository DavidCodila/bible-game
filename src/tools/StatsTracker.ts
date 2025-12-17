const ONE_SECOND_IN_MILLISECONDS = 1000;
const HISTORY_CAPACITY_FRAMES = 120; // Enough for 2 seconds at 60 FPS

interface PerformanceStats {
    frameStartTime: number;
    frameTimeHistory: number[];
    avgFrameTime: number;
    avgFPS: number;
    lastLogTime: number;
}

export class StatsTracker {
    private stats: PerformanceStats;
    private readonly logIntervalMs = 2000; // Log every 2 seconds

    constructor () {
        this.stats = {
            frameStartTime: performance.now(),
            frameTimeHistory: [],
            avgFrameTime: 0,
            avgFPS: 0,
            lastLogTime: performance.now(),
        };
    }

    // Called once per frame in the main render loop
    public update() {
        this.calculateRunningAverage();
        this.logSmoothMetricsPeriodically();
    }

    private calculateRunningAverage() {
        // 1. Measure the time elapsed since the last frame
        const newFrameEndTime = performance.now();
        const rawFrameTime = newFrameEndTime - this.stats.frameStartTime;

        // GUARD CLAUSE: Ignore extreme values (stutters or errors)
        if (rawFrameTime <= 0 || rawFrameTime > 100) {
            return; 
        }

        this.stats.frameStartTime = newFrameEndTime; 

        // SLIDING WINDOW: Add new time and remove oldest if capacity is exceeded
        this.stats.frameTimeHistory.push(rawFrameTime);
        if (this.stats.frameTimeHistory.length > HISTORY_CAPACITY_FRAMES) {
            this.stats.frameTimeHistory.shift(); 
        }
        
        // CALCULATE AVERAGE
        const totalTime = this.stats.frameTimeHistory.reduce((sum, time) => sum + time, 0);
        this.stats.avgFrameTime = totalTime / this.stats.frameTimeHistory.length;
        this.stats.avgFPS = ONE_SECOND_IN_MILLISECONDS / this.stats.avgFrameTime;
    }

    private logSmoothMetricsPeriodically() {
        if (performance.now() >= this.stats.lastLogTime + this.logIntervalMs) {
            console.log(`Avg FPS: ${this.stats.avgFPS.toFixed(1)} | Avg Frame Time: ${this.stats.avgFrameTime.toFixed(2)}ms`); 
            this.stats.lastLogTime = performance.now();
        }
    }
}