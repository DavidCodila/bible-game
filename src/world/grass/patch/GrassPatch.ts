import * as THREE from 'three';
import { GeometryUtils } from '../../../utils/math/GeometryUtils';
import { DataGenerator } from '../generator/DataGenerator';
import { GrassGeometryFactory } from '../GrassGeometryFactory'; 
import { GrassShader } from '../GrassShader';
import { BoundsHelper } from "./BoundsHelper";
import { ThreeUtils } from '../../../utils/three/ThreeUtils';
import type { MeshGameObject } from '../../../types/engine';
import type { GrassPatchConfig } from "../types";
import type { WindService } from '../../wind/WindService';

export class GrassPatch implements MeshGameObject{
    public mesh: THREE.InstancedMesh;  
    private grassShader: GrassShader; 
    
    constructor(config: GrassPatchConfig, windService: WindService) {
        const totalBlades = config.bladesPerRow * config.bladesPerRow;
        const bladeConfig = config.grassBladeConfig;
        const geometry = GrassGeometryFactory.createBladeGeometry(bladeConfig);
        const attributeData = DataGenerator.generateAttributes(config);

        this.grassShader = new GrassShader(bladeConfig.bladeHeight, windService);
        
        this.mesh = new THREE.InstancedMesh(geometry, this.grassShader.material, totalBlades);

        GeometryUtils.assignInstancedAttributes(geometry, attributeData);
        
        BoundsHelper.computePatchBounds(this.mesh, config);
        this.mesh.frustumCulled = true;
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