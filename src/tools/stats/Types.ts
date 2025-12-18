export interface PerformanceMetrics {
    frameStartTime: number;
    frameTimeHistory: number[];
    avgFrameTime: number;
    avgFPS: number;
    lastLogTime: number;
}