import * as THREE from 'three';
import { GeometryUtils } from '../../../utils/math/GeometryUtils';
import { DataGenerator } from '../generator/DataGenerator';
import { GrassGeometryFactory } from '../GrassGeometryFactory'; 
import { GrassShader } from '../GrassShader';
import { ThreeUtils } from '../../../utils/three/ThreeUtils';
import type { MeshGameObject } from '../../../types/engine';
import type { GrassPatchConfig } from "../types";
import type { WindService } from '../../wind/WindService';

export class GrassPatch implements MeshGameObject{
    public mesh: THREE.InstancedMesh;  
    private grassShader: GrassShader; 
    
    constructor(config: GrassPatchConfig, windService: WindService) {
        const geometry = GrassGeometryFactory.createBladeGeometry(config.grassBladeConfig);
        const attributeData = DataGenerator.generateAttributes(config);   // now has .count
    
        this.grassShader = new GrassShader(config.grassBladeConfig.bladeHeight, windService);
        
        // Use real blade count instead of theoretical max
        this.mesh = new THREE.InstancedMesh(
            geometry,
            this.grassShader.material,
            attributeData.count          // ← CHANGED
        );
    
        GeometryUtils.assignInstancedAttributes(geometry, attributeData);
        
        this.mesh.frustumCulled = false;
    }

    public update(_elapsedTime: number): void {
        //will be used later for LOD DITHERING
    }

    public setOpacity(opacity: number): void {
        this.grassShader.setOpacity(opacity);
    }

    dispose(): void {
        this.grassShader.dispose();
        ThreeUtils.disposeMesh(this.mesh);
        (this.mesh as any).instanceMatrix = null;
        (this as any).grassShader = null;
        (this as any).mesh = null;
        
        console.log("GrassPatch: Instanced resources and shader disposed.");
    }
}