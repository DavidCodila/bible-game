import * as THREE from 'three';
import { GeometryUtils } from '../../tools/GeometryUtils';
import { DataGenerator } from '../generator/DataGenerator';
import { GrassGeometryFactory } from '../GrassGeometryFactory'; 
import { GrassShader } from '../GrassShader';
import { BoundsHelper } from "./BoundsHelper";
import type { GrassPatchConfig } from "../types";

export class GrassPatch {
    public mesh: THREE.InstancedMesh;  
    private grassShader: GrassShader; 
    
    constructor(config: GrassPatchConfig) {
        const totalBlades = config.bladesPerRow * config.bladesPerRow;
        const bladeConfig = config.grassBladeConfig;
        
        // 1. Initialize the custom geometry and the shader material
        // This ensures the blade segments and height are correctly set
        const geometry = GrassGeometryFactory.createBladeGeometry(bladeConfig);
        this.grassShader = new GrassShader(bladeConfig.bladeHeight);
        
        // 2. Create the InstancedMesh using your custom shader
        this.mesh = new THREE.InstancedMesh(geometry, this.grassShader.material, totalBlades);

        // 3. Generate the self-describing attribute data (the object with the list)
        const attributeData = DataGenerator.generateAttributes({
            totalBlades,
            sideLength: config.sideLength,
            bladesPerRow: config.bladesPerRow,
            gridSpacing: config.sideLength / config.bladesPerRow
        });

        // 4. Use the General Utility to bind the generated data to the mesh geometry
        GeometryUtils.assignInstancedAttributes(geometry, attributeData);
        
        // 5. Compute the bounding sphere using the patch dimensions and blade height
        BoundsHelper.computePatchBounds(this.mesh, config);
    }

    /**
     * Updates the shader uniforms (like time and wind) for the grass animation.
     */
    public update(deltaTime: number): void {
        this.grassShader.update(deltaTime);
    }
}