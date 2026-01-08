// @vitest-environment node
import * as THREE from 'three';
import { BoundsHelper } from '../../../../src/grass/patch/BoundsHelper';
import type { GrassPatchConfig } from '../../../../src/grass/types';

describe('BoundsHelper', () => {
    const MAX_NUMBER_OF_INSTANCES = 1;
    let instancedMesh: THREE.InstancedMesh;
    let grassPatchConfiguration: GrassPatchConfig;

    beforeEach(() => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial();
        instancedMesh = new THREE.InstancedMesh(geometry, material, MAX_NUMBER_OF_INSTANCES);

        grassPatchConfiguration = {
            sideLength: 10,
            grassBladeConfig: {
                bladeHeight: 2
            }
        } as GrassPatchConfig;
    });

    describe('computePatchBounds', () => {
        it('should precisely calculate the radius to encompass both the area and blade height', () => {
            const halfSideLength = grassPatchConfiguration.sideLength / 2;
            const bladeHeight = grassPatchConfiguration.grassBladeConfig.bladeHeight;
            
            const expectedRadius = Math.sqrt(
                (halfSideLength * halfSideLength) + 
                (halfSideLength * halfSideLength) + 
                (bladeHeight * bladeHeight)
            );

            BoundsHelper.computePatchBounds(instancedMesh, grassPatchConfiguration);

            const boundingSphere = instancedMesh.geometry.boundingSphere;
            
            expect(boundingSphere).not.toBeNull();
            if (boundingSphere) {
                const NUMBER_OF_DECIMAL_POINTS = 5;
                expect(boundingSphere.radius).toBeCloseTo(expectedRadius, NUMBER_OF_DECIMAL_POINTS);
            }
        });

       it('should handle geometries that have no initial bounding sphere', () => {
            instancedMesh.geometry.boundingSphere = null as (THREE.Sphere | null);
            
            BoundsHelper.computePatchBounds(instancedMesh, grassPatchConfiguration);
            
            const updatedSphere = instancedMesh.geometry.boundingSphere;
            
            expect(updatedSphere).not.toBeNull();

            if (updatedSphere) {
                expect(updatedSphere.radius).toBeGreaterThan(0);
            }
        });

        it('should be safe to execute even if the geometry produces a null sphere after computation', () => {
            vi.spyOn(instancedMesh.geometry, 'computeBoundingSphere').mockImplementation(() => {
                instancedMesh.geometry.boundingSphere = null;
            });

            expect(() => {
                BoundsHelper.computePatchBounds(instancedMesh, grassPatchConfiguration);
            }).not.toThrow();
        });
    });
});