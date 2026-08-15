import * as THREE from 'three';

export class InstancedMeshFactory {
    public static create(sourceMesh: THREE.Mesh, matrices: THREE.Matrix4[]): THREE.InstancedMesh {
        const instanceCount = matrices.length;
        
        const instancedMesh = new THREE.InstancedMesh(
            sourceMesh.geometry,
            sourceMesh.material,
            instanceCount
        );

        for (let i = 0; i < instanceCount; i++) {
            instancedMesh.setMatrixAt(i, matrices[i]);
        }

        instancedMesh.castShadow = false;
        instancedMesh.receiveShadow = false;
        instancedMesh.frustumCulled = false;
        instancedMesh.instanceMatrix.needsUpdate = true;

        return instancedMesh;
    }
}