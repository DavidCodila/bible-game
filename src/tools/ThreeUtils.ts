import * as THREE from 'three';

export class ThreeUtils {
    public static disposeMesh(mesh: THREE.Mesh): void {
        mesh.geometry.dispose();

        if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => this.disposeMaterial(material));
        } else {
            this.disposeMaterial(mesh.material);
        }
    }

    private static disposeMaterial(material: THREE.Material): void {
        for (const propertyName in material) {
            const value = (material as any)[propertyName];

            if (value && value.isTexture) {
                value.dispose();
            }
        }

        material.dispose();
    }
}