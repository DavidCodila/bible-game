import { StatsTracker } from '@src/tools/stats/Tracker';

describe('Path Alias Test', () => {
  it('should import StatsTracker using the @src alias', () => {
    const stats = new StatsTracker();
    expect(stats).toBeDefined();
  });
});