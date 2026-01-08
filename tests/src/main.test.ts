import { GardenOfEdenApp } from '../../src/app/GardenOfEdenApp';

vi.mock('@src/app/GardenOfEdenApp', () => ({ GardenOfEdenApp: vi.fn() }));

describe('main.ts entry point', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('should wait for DOMContentLoaded if document is loading', async () => {
        Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
        
        await import('../../src/main');
        
        expect(GardenOfEdenApp).not.toHaveBeenCalled();
        
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(GardenOfEdenApp).toHaveBeenCalledTimes(1);
    });

    it('should initialize immediately if document is already complete', async () => {
        Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
        
        await import('../../src/main');
        
        expect(GardenOfEdenApp).toHaveBeenCalledTimes(1);
    });

    
});