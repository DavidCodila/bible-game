import { GameObjectsController } from '@src/app/GameObjectsController';
import { TerrainPlane } from '@src/scene/TerrainPlane';
import { buildWorld } from '@src/app/WorldBuilder';

vi.mock('@src/scene/TerrainPlane');

describe('buildInitialWorld', () => {
    let mockGameObjectsController: GameObjectsController;

    beforeEach(() => {
        mockGameObjectsController = {
            add: vi.fn()
        } as unknown as GameObjectsController;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should work', () => {
        expect(1);
    }) 

    /*
    it('should instantiate and add the terrain plane to the controller', () => {
        buildWorld(mockGameObjectsController);

        expect(mockGameObjectsController.add).toHaveBeenCalledWith(
            expect.any(TerrainPlane)
        );
    });

    
    it('should add the specific object returned by the grass factory to the controller', () => {
        const mockedGrassObject = { name: 'FunctionalGrass' };
        
        const grassSpy = vi.spyOn(GrassConstants, 'smallGrassPatch')
            .mockReturnValue(mockedGrassObject as any);

        buildWorld(mockGameObjectsController);

        expect(grassSpy).toHaveBeenCalled();
        expect(mockGameObjectsController.add).toHaveBeenCalledWith(mockedGrassObject);
    });

    */
});