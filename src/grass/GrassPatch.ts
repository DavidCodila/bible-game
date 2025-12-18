import * as THREE from 'three';
import { GrassGeometryFactory } from './GrassGeometryFactory'; 
import { GrassDataGenerator } from './GrassDataGenerator'; 
import { GrassShader } from './GrassShader';
import type { GrassPatchConfig } from "./types";

/**
 * The orchestrator class. Manages Three.js resources (Mesh, Material, Shader) 
 * and delegates heavy attribute calculation to dedicated utilities.
 */
export class GrassPatch {
    public mesh: THREE.InstancedMesh;  
    private grassShader: GrassShader; 
    private config: GrassPatchConfig; 
    
    private readonly totalBlades: number;
    
    constructor(config: GrassPatchConfig) {
        this.config = config
        this.totalBlades = config.bladesPerRow * config.bladesPerRow;
        const grassBladeConfig = config.grassBladeConfig;
        const bladeGeometry = GrassGeometryFactory.createBladeGeometry(grassBladeConfig);
        
        this.grassShader = new GrassShader(grassBladeConfig.bladeHeight);
        this.mesh = new THREE.InstancedMesh(
            bladeGeometry, 
            this.grassShader.material, 
            this.totalBlades
        );

        this.calculateAndAssignAttributes(bladeGeometry);
        this.applyBoundingSphereFix(grassBladeConfig.bladeHeight);
    }

    private calculateAndAssignAttributes(bladeGeometry: THREE.BufferGeometry): void {
        const gridSpacing = this.config.sideLength / this.config.bladesPerRow;

        const generationConfig = {
            totalBlades: this.totalBlades,
            sideLength: this.config.sideLength,
            bladesPerRow: this.config.bladesPerRow,
            gridSpacing: gridSpacing
        };

        const attributes = GrassDataGenerator.generateAttributes(generationConfig);
        
        bladeGeometry.setAttribute("instanceOffsets", new THREE.InstancedBufferAttribute(attributes.instanceOffsets, 3));
        bladeGeometry.setAttribute("instanceYAxisRotation", new THREE.InstancedBufferAttribute(attributes.instanceYAxisRotations, 1));
        bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(attributes.instanceYAxisScales, 1));
        bladeGeometry.setAttribute("instanceBendX", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsX, 1)); 
        bladeGeometry.setAttribute("instanceBendZ", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsZ, 1)); 
        bladeGeometry.setAttribute("instanceColors", new THREE.InstancedBufferAttribute(attributes.instanceColors, 3));  
    }

    private applyBoundingSphereFix(bladeHeight : number): void {
        this.mesh.geometry.computeBoundingSphere(); 
        
        const patchDiagonalHalf = Math.sqrt(this.config.sideLength ** 2 * 2) / 2;
        
        const sphere = this.mesh.geometry.boundingSphere;
        if (sphere) {
            sphere.radius = patchDiagonalHalf + bladeHeight;
        }
    }

    public update(deltaTime: number): void {
        this.grassShader.update(deltaTime);
    }
}