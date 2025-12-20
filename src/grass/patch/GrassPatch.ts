import * as THREE from 'three';
import { GeometryUtils } from '../../tools/GeometryUtils';
import { DataGenerator } from '../generator/DataGenerator';
import { GrassGeometryFactory } from '../GrassGeometryFactory'; 
import { GrassShader } from '../GrassShader';
import { BoundsHelper } from "./BoundsHelper";
import type { MeshGameObject } from '../../app/types';
import type { GrassPatchConfig } from "../types";
import { ThreeUtils } from '../../tools/ThreeUtils';

export class GrassPatch implements MeshGameObject{
    public mesh: THREE.InstancedMesh;  
    private grassShader: GrassShader; 
    
    constructor(config: GrassPatchConfig) {
        const totalBlades = config.bladesPerRow * config.bladesPerRow;
        const bladeConfig = config.grassBladeConfig;
        const geometry = GrassGeometryFactory.createBladeGeometry(bladeConfig);
        this.grassShader = new GrassShader(bladeConfig.bladeHeight);
        
        this.mesh = new THREE.InstancedMesh(geometry, this.grassShader.material, totalBlades);

        const attributeData = DataGenerator.generateAttributes({
            totalBlades,
            sideLength: config.sideLength,
            bladesPerRow: config.bladesPerRow,
            gridSpacing: config.sideLength / config.bladesPerRow
        });

        GeometryUtils.assignInstancedAttributes(geometry, attributeData);
        
        BoundsHelper.computePatchBounds(this.mesh, config);
    }
    dispose(): void {
        this.grassShader.dispose();
        ThreeUtils.disposeMesh(this.mesh);
        // PREVENT ACCIDENTAL UPDATES
        (this.mesh as any).instanceMatrix = null;
        (this as any).grassShader = null;
        (this as any).mesh = null;
        
        console.log("GrassPatch: Instanced resources and shader disposed.");
    }

    public update(deltaTime: number): void {
        this.grassShader.update(deltaTime);
    }
}