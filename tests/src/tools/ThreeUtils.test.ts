// @vitest-environment node
import { ThreeUtils } from '@src/tools/ThreeUtils'; 

describe('ThreeUtils', () => {
    let geometry: THREE.BoxGeometry;
    let material: THREE.MeshBasicMaterial;
    let mesh: THREE.Mesh;

    beforeEach(() => {
        geometry = new THREE.BoxGeometry();
        material = new THREE.MeshBasicMaterial();
        mesh = new THREE.Mesh(geometry, material);
    });

    it('should dispose of the mesh geometry', () => {
        const geometrySpy = vi.spyOn(geometry, 'dispose');

        ThreeUtils.disposeMesh(mesh);

        expect(geometrySpy).toHaveBeenCalledTimes(1);
    });

    it('should dispose of the material when a single material is provided', () => {
        const materialSpy = vi.spyOn(material, 'dispose');

        ThreeUtils.disposeMesh(mesh);

        expect(materialSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispose of every material when an array is provided', () => {
        const materials = [
            new THREE.MeshBasicMaterial(),
            new THREE.MeshBasicMaterial()
        ];
        const arrayMesh = new THREE.Mesh(geometry, materials);
        const spies = materials.map(m => vi.spyOn(m, 'dispose'));

        ThreeUtils.disposeMesh(arrayMesh);

        spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
    });

    it('should dispose of any textures attached to the material', () => {
        const texture = new THREE.Texture();
        const textureSpy = vi.spyOn(texture, 'dispose');
        
        material.map = texture;

        ThreeUtils.disposeMesh(mesh);

        expect(textureSpy).toHaveBeenCalledTimes(1);
    });

    it('should find textures even if they are defined on the prototype', () => {
        const material = new THREE.MeshStandardMaterial();
        const texture = new THREE.Texture();
        const textureSpy = vi.spyOn(texture, 'dispose');
        
        material.map = texture;

        ThreeUtils.disposeMesh(new THREE.Mesh(geometry, material));

        expect(textureSpy).toHaveBeenCalled();
    });
});