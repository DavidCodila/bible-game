import { StatsTracker } from '@src/tools/stats/StatsTracker';
import { STATS_CONFIG } from '@src/tools/stats/Constants';

describe('StatsTracker', () => {
    let tracker: StatsTracker;
    const startTime = 1000;
    const frameTime = 10;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(startTime);
        tracker = new StatsTracker();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with an empty history', () => {
        expect(tracker.get_metrics.frameTimeHistory).toEqual([]);
    });

    it('should calculate avgFrameTime for a single frame', () => {
        vi.advanceTimersByTime(frameTime); 
        tracker.update();
        
        expect(tracker.get_metrics.avgFrameTime).toBe(frameTime);
    });

    it('should calculate avgFPS based on the avgFrameTime', () => {
        const FPS = STATS_CONFIG.ONE_SECOND_IN_MILLISECONDS / frameTime;
        vi.advanceTimersByTime(frameTime); // 10ms frame = 100 FPS
        tracker.update();
        
        expect(tracker.get_metrics.avgFPS).toBe(FPS);
    });

    it('should cap the history length at STATS_CONFIG.HISTORY_CAPACITY', () => {
        const exceedBy = 10;
        const overLimit = STATS_CONFIG.HISTORY_CAPACITY + exceedBy;
        
        for (let i = 0; i < overLimit; i++) {
            vi.advanceTimersByTime(exceedBy);
            tracker.update();
        }

        expect(tracker.get_metrics.frameTimeHistory.length).toBe(STATS_CONFIG.HISTORY_CAPACITY);
    });

    it('should ignore frames that exceed 100ms', () => {
        const exceededFrameTime = 150;
        vi.advanceTimersByTime(exceededFrameTime); // Lag spike
        tracker.update();

        // The spike should be rejected; history stays empty
        expect(tracker.get_metrics.frameTimeHistory.length).toBe(0);
    });

    it('should update lastLogTime after a successful log', () => {
        // Start at 1000. Interval is 2000.
        const initialTime = tracker.get_metrics.lastLogTime 
        vi.advanceTimersByTime(STATS_CONFIG.LOG_INTERVAL_IN_MILLISECONDS);
        tracker.update();

        expect(tracker.get_metrics.lastLogTime).toBe(initialTime + STATS_CONFIG.LOG_INTERVAL_IN_MILLISECONDS);
    });

    it('should clear all history data upon disposal', () => {
        vi.advanceTimersByTime(frameTime);
        tracker.update();
        
        tracker.dispose();
        
        expect(tracker.get_metrics.frameTimeHistory).toEqual([]);
    });
});