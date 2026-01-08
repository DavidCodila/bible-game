import * as THREE from 'three';
import { SUN_DIRECTION } from '../../../src/scene/Constants';

describe('Constants', () => {
    describe('SUN_DIRECTION', () => {
        it('should be an instance of THREE.Vector3', () => {
            expect(SUN_DIRECTION).toBeInstanceOf(THREE.Vector3);
        });

        it('should be normalized for shader lighting calculations', () => {
            const vectorLength = SUN_DIRECTION.length();
            const tolerance = 0.0001; 
            
            expect(Math.abs(vectorLength - 1)).toBeLessThan(tolerance);
        });
    });
});