// @vitest-environment node
import { GrassPatch } from '@src/grass/patch/GrassPatch';
import { GrassGeometryFactory } from '@src/grass/GrassGeometryFactory';
import { DataGenerator } from '@src/grass/generator/DataGenerator';
import { GeometryUtils } from '@src/tools/GeometryUtils';
import { ThreeUtils } from '@src/tools/ThreeUtils';
import { GrassShader } from '@src/grass/GrassShader';
import { SUN_DIRECTION } from '@src/scene/Constants';
import { GRASS_BUFFER_LAYOUT } from '@src/grass/generator/GrassConstants';
import { GrassAttributeAccessor } from '@src/grass/generator/GrassAttributeAccessor';
import type { GrassPatchConfig } from '@src/grass/types';
import type { AttributeBuffer, InstancedAttributeData } from '@src/types/rendering';

const mockShaderInstance = {
    material: new THREE.ShaderMaterial(),
    update: vi.fn(),
    dispose: vi.fn(),
};

vi.mock('@src/grass/GrassGeometryFactory');
vi.mock('@src/grass/generator/DataGenerator');
vi.mock('@src/tools/GeometryUtils');
vi.mock('@src/grass/patch/BoundsHelper');
vi.mock('@src/tools/ThreeUtils');

vi.mock('@src/grass/GrassShader', () => {
    return {
        GrassShader: vi.fn().mockImplementation(function () {
            return mockShaderInstance;
        })
    };
});

function createTestAttributeData(bladesPerRow: number): InstancedAttributeData {
    const totalBlades = bladesPerRow * bladesPerRow;
    const attributeList: AttributeBuffer[] = [];

    GRASS_BUFFER_LAYOUT.forEach(item => {
        attributeList[item.index] = {
            name: item.name,
            itemSize: item.itemSize,
            storage: new Float32Array(totalBlades * item.itemSize)
        };
    });

    return {
        attributeList,
        accessor: new GrassAttributeAccessor(attributeList)
    };
}

describe('GrassPatch', () => {
    let grassPatchConfiguration: GrassPatchConfig;
    let grassPatch: GrassPatch;
    const bladesPerRow = 10;
    const mockGeometry = new THREE.BufferGeometry();
    let mockData: InstancedAttributeData;

    beforeEach(() => {
        grassPatchConfiguration = {
            sideLength: 10,
            bladesPerRow: bladesPerRow,
            grassBladeConfig: {
                bladeHeight: 0.5,
                bladeWidth: 0.05,
                segmentsPerBlade: 6
            }
        };
        
        mockData = createTestAttributeData(grassPatchConfiguration.bladesPerRow);

        vi.mocked(GrassGeometryFactory.createBladeGeometry).mockReturnValue(mockGeometry);
        vi.mocked(DataGenerator.generateAttributes).mockReturnValue(mockData);

        grassPatch = new GrassPatch(grassPatchConfiguration);
    });

    afterEach(() => {
        if (grassPatch && (grassPatch as any).grassShader !== null) {
            grassPatch.dispose();
        }
    });

    describe('Initialization', () => {
        it('should create an InstancedMesh with the correct blade count', () => {
            const bladeCount = bladesPerRow * bladesPerRow;
            expect(grassPatch.mesh.count).toBe(bladeCount);
        });

        it('should pass the system default sun direction to the shader', () => {
            expect(GrassShader).toHaveBeenCalledWith(
                grassPatchConfiguration.grassBladeConfig.bladeHeight,
                SUN_DIRECTION
            );
        });

        it('should assign generated attributes to the geometry', () => {
            expect(GeometryUtils.assignInstancedAttributes).toHaveBeenCalledWith(
                mockGeometry, 
                mockData
            );
        });
    });

    describe('Runtime & Disposal', () => {
        it('should forward update calls to the grass shader', () => {
            const deltaTime = 0.016;
            grassPatch.update(deltaTime);
            
            expect(mockShaderInstance.update).toHaveBeenCalledWith(deltaTime);
        });

        it('should dispose of both the shader and the mesh', () => {
            const meshReference = grassPatch.mesh;
            vi.spyOn(console, 'log').mockImplementation(() => {});

            grassPatch.dispose();

            expect(mockShaderInstance.dispose).toHaveBeenCalled();
            expect(ThreeUtils.disposeMesh).toHaveBeenCalledWith(meshReference);
            expect(grassPatch.mesh).toBeNull();
        });
    });
});