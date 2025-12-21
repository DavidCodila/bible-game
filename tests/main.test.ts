import { GardenOfEdenApp } from '@src/app/GardenOfEdenApp';

vi.mock('@src/app/GardenOfEdenApp', () => {
    return {
        GardenOfEdenApp: vi.fn()
    };
});

describe('main.ts entry point', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    it('should initialize GardenOfEdenApp when DOMContentLoaded fires', async () => {
        await import('@src/main');

        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        expect(GardenOfEdenApp).toHaveBeenCalledTimes(1);
    });
});