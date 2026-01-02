// @vitest-environment node
import { defaultGrassPatch, brightGrassPatch } from "@src/grass/Constants";
import { GrassPatch } from "@src/grass/patch/GrassPatch";
import { DARK_GRASS_APPEARANCE, BRIGHT_GRASS_APPEARANCE } from '@src/grass/generator/AppearanceConfig';

vi.mock('@src/grass/patch/GrassPatch');

describe('Grass Constants Factories', () => {

    describe('defaultGrassPatch', () => {
        it('should pass DARK_GRASS_APPEARANCE to the GrassPatch constructor', () => {
            defaultGrassPatch();

            expect(GrassPatch).toHaveBeenCalledWith(expect.objectContaining({
                appearance: DARK_GRASS_APPEARANCE
            }));
        });
    });

    describe('brightGrassPatch', () => {
        it('should pass BRIGHT_GRASS_APPEARANCE to the GrassPatch constructor', () => {
            brightGrassPatch();

            expect(GrassPatch).toHaveBeenCalledWith(expect.objectContaining({
                appearance: BRIGHT_GRASS_APPEARANCE
            }));
        });
    });

    it('should produce a new instance on every call', () => {
        const firstInstance = defaultGrassPatch();
        const secondInstance = brightGrassPatch();

        expect(GrassPatch).toHaveBeenCalledTimes(2);
        expect(firstInstance).not.toBe(secondInstance);
    });
});