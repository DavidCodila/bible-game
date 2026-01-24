// @vitest-environment node
import * as THREE from 'three';
import { TerrainPlane } from '../../../src/world/terrain/TerrainPlane';
import { ThreeUtils } from '../../../src/utils/ThreeUtils'; 

describe('TerrainPlane', () => {
    let terrainPlane: TerrainPlane;

    beforeEach(() => {
        terrainPlane = new TerrainPlane();
    });

    describe('Initialization', () => {
        it('should initialize with a standard PlaneGeometry', () => {
            expect(terrainPlane.mesh.geometry).toBeInstanceOf(THREE.PlaneGeometry);
        });

        it('should configure the ground material with the correct properties', () => {
            const material = terrainPlane.mesh.material;

            expect(material).toBeInstanceOf(THREE.MeshBasicMaterial);

            const basicMaterial = material as THREE.MeshBasicMaterial;
            expect(basicMaterial.color.getHex()).toBe(0x3d2817);
        });
    });

    describe('Spatial Positioning', () => {
        it('should be oriented horizontally via a -90 degree X-axis rotation', () => {
            const halfPiInRadians = Math.PI / 2;
            expect(terrainPlane.mesh.rotation.x).toBeCloseTo(-halfPiInRadians);
        });
    });

    describe('Engine Integration', () => {
        it('should fulfill the MeshGameObject update contract without throwing errors', () => {
            // We test with a standard frame time (60 FPS ≈ 0.016s)
            const frameTimeSeconds = 0.016;
            
            expect(() => {
                terrainPlane.update(frameTimeSeconds);
            }).not.toThrow();
        });

        it('should handle unusual delta time values safely', () => {
            // Extreme cases: 0 (paused) and negative (rewinding/glitch)
            expect(() => terrainPlane.update(0)).not.toThrow();
            expect(() => terrainPlane.update(-1.0)).not.toThrow();
        });
    });

    describe('Resource Management', () => {
        it('should delegate resource cleanup to ThreeUtils', () => {
            const disposeMeshSpy = vi.spyOn(ThreeUtils, 'disposeMesh');
            
            terrainPlane.dispose();
            
            expect(disposeMeshSpy).toHaveBeenCalledWith(terrainPlane.mesh);
        });

        it('should suppress console logs in tests while verifying disposal output', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            
            terrainPlane.dispose();
            
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("TerrainPlane cleaned up via ThreeUtils."));
            
            logSpy.mockRestore();
        });
    });
});