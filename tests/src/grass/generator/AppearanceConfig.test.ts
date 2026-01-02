// @vitest-environment node
import { 
    DARK_GRASS_APPEARANCE, 
    BRIGHT_GRASS_APPEARANCE, 
    DEFAULT_GRASS_APPEARANCE,
    type GrassAppearanceConfig 
} from '@src/grass/generator/AppearanceConfig';

describe('AppearanceConfig', () => {
    const validateAppearanceConfig = (config: GrassAppearanceConfig, name: string) => {
        describe(`${name} configuration`, () => {

            it('should have positive rotation range', () => {
                expect(config.rotationRange).toBeGreaterThan(0);
            });

            it('should have valid scale parameters', () => {
                expect(config.scaleMinimum).toBeGreaterThan(0);
                expect(config.scaleRange).toBeGreaterThan(0);
            });

            it('should not lean further than its minimum height to prevent ground clipping', () => {
                const totalMaxLean = config.leanMagnitudeMinimum + config.leanMagnitudeRange;
                expect(totalMaxLean).toBeLessThan(config.scaleMinimum);
            });

            it('should have valid lean parameters', () => {
                expect(config.leanMagnitudeMinimum).toBeGreaterThanOrEqual(0);
                expect(config.leanMagnitudeRange).toBeGreaterThanOrEqual(0);
                expect(config.leanDirectionRange).toBeGreaterThan(0);
            });

            it('should have RGB color ranges that produce valid colors', () => {
                for (const channel in config.colorRanges) {
                    const range = config.colorRanges[channel as keyof typeof config.colorRanges];
                    
                    expect(range.minimum).toBeGreaterThanOrEqual(0);
                    expect(range.minimum).toBeLessThanOrEqual(1);
                    expect(range.minimum + range.range).toBeLessThanOrEqual(1);
                }
            });
        });
    };

    validateAppearanceConfig(DARK_GRASS_APPEARANCE, 'DARK_GRASS_APPEARANCE');
    validateAppearanceConfig(BRIGHT_GRASS_APPEARANCE, 'BRIGHT_GRASS_APPEARANCE');

    it('should have DEFAULT_GRASS_APPEARANCE reference DARK_GRASS_APPEARANCE', () => {
        expect(DEFAULT_GRASS_APPEARANCE).toBe(DARK_GRASS_APPEARANCE);
    });

    it('should have BRIGHT grass with higher average green than DARK', () => {
        const getMidPoint = (min: number, range: number) => min + (range / 2);
        
        const darkGreenMid = getMidPoint(
            DARK_GRASS_APPEARANCE.colorRanges.green.minimum, 
            DARK_GRASS_APPEARANCE.colorRanges.green.range
        );
        const brightGreenMid = getMidPoint(
            BRIGHT_GRASS_APPEARANCE.colorRanges.green.minimum, 
            BRIGHT_GRASS_APPEARANCE.colorRanges.green.range
        );

        expect(brightGreenMid).toBeGreaterThan(darkGreenMid);
    });
});