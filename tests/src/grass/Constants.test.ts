import { defaultGrassPatch } from "@src/grass/Constants";
import { GrassPatch } from "@src/grass/patch/GrassPatch";

vi.mock('@src/grass/patch/GrassPatch');

describe('defaultGrassPatch', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return a new GrassPatch instance when invoked', () => {
        const grassPatchInstance = defaultGrassPatch();

        expect(grassPatchInstance).toBeInstanceOf(GrassPatch);
        expect(GrassPatch).toHaveBeenCalledTimes(1);
    });

    it('should pass the correct configuration to the GrassPatch constructor', () => {
        defaultGrassPatch();

        expect(GrassPatch).toHaveBeenCalledWith({
            sideLength: 10,
            bladesPerRow: 150,
            grassBladeConfig: {
                bladeHeight: 0.4,
                bladeWidth: 0.05,
                segmentsPerBlade: 6
            }
        });
    });

    it('should produce a unique instance on every call', () => {
        const firstInstance = defaultGrassPatch();
        const secondInstance = defaultGrassPatch();

        expect(GrassPatch).toHaveBeenCalledTimes(2);
        
        expect(firstInstance).not.toBe(secondInstance);
    });
});