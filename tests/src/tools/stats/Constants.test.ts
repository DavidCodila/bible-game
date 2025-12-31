// @vitest-environment node
import { STATS_CONFIG } from '@src/tools/stats/Constants';

describe('Constants', () => {
    it('should have the correct STATS_CONFIG values', () => {
        expect(STATS_CONFIG.ONE_SECOND_IN_MILLISECONDS).toBe(1000);
        expect(STATS_CONFIG.HISTORY_CAPACITY).toBe(120);
        expect(STATS_CONFIG.LOG_INTERVAL_IN_MILLISECONDS).toBe(2000);
    });
});