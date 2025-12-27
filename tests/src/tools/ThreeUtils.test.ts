import * as THREE from 'three';
import { ThreeUtils } from '@src/tools/ThreeUtils'; 

describe('ThreeUtils', () => {

    it('should trigger the disposal sequence for a standard mesh unit', () => {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(), 
            new THREE.MeshBasicMaterial()
        );

        // We only spy on the specific 'dispose' behaviors we expect
        const geometrySpy = vi.spyOn(mesh.geometry, 'dispose');
        const materialSpy = vi.spyOn(mesh.material as THREE.Material, 'dispose');

        ThreeUtils.disposeMesh(mesh);

        expect(geometrySpy).toHaveBeenCalled();
        expect(materialSpy).toHaveBeenCalled();
    });

    it('should iterate through all texture slots in a material unit', () => {
        const material = new THREE.MeshBasicMaterial();
        const texture = new THREE.Texture();
        const textureSpy = vi.spyOn(texture, 'dispose');

        // Manually attaching the texture to the 'unit'
        material.map = texture;

        // Since we treat the material as a single unit with our utility:
        ThreeUtils.disposeMesh(new THREE.Mesh(new THREE.BufferGeometry(), material));

        expect(textureSpy).toHaveBeenCalled();
    });
});