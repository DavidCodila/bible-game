import * as THREE from 'three';
import { GrassGeometryFactory } from './GrassGeometryFactory'; 
import { GrassDataGenerator } from './GrassDataGenerator'; 
import { BladeDensityOcclusion } from './BladeDensityOcclusion'; 
import { GrassShader } from './GrassShader';
import type { GrassPatchConfig, AODensityConfig } from "./types";

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
        this.applyBoundingSphereFix();
    }

    private calculateAndAssignAttributes(bladeGeometry: THREE.BufferGeometry): void {
        const gridSpacing = this.config.sideLength / this.config.bladesPerRow;

        const generationConfig = {
            totalBlades: this.totalBlades,
            sideLength: this.config.sideLength,
            bladesPerRow: this.config.bladesPerRow,
            gridSpacing: gridSpacing
        };

        // --- 1. GENERATE BASE ATTRIBUTES ---
        const attributes = GrassDataGenerator.generateAttributes(generationConfig);
        
        // --- 2. CALCULATE AO (Uses the efficient Spatial Hash Grid) ---
        const aoConfig : AODensityConfig = {
            grassPatchSideLength: this.config.sideLength,
            maximumNeighborDistance: gridSpacing * 2.5,
            densityRequiredForMaxAO: 20.0
        };
        const aoCalculator = new BladeDensityOcclusion(aoConfig);
        
        // Pass the generated positions to the AO calculator
        const instanceAmbientOcclusion = aoCalculator.calculateAO(attributes.instanceOffsets);


        // --- 3. ASSIGN ALL ATTRIBUTES TO GEOMETRY ---
        bladeGeometry.setAttribute("instanceOffsets", new THREE.InstancedBufferAttribute(attributes.instanceOffsets, 3));
        bladeGeometry.setAttribute("instanceYAxisRotation", new THREE.InstancedBufferAttribute(attributes.instanceYAxisRotations, 1));
        bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(attributes.instanceYAxisScales, 1));
        bladeGeometry.setAttribute("instanceBendX", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsX, 1)); 
        bladeGeometry.setAttribute("instanceBendZ", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsZ, 1)); 
        bladeGeometry.setAttribute("instanceColors", new THREE.InstancedBufferAttribute(attributes.instanceColors, 3));
        
        // Assign the calculated AO
        bladeGeometry.setAttribute("instanceAmbientOcclusion", new THREE.InstancedBufferAttribute(instanceAmbientOcclusion, 1));
    }

    private applyBoundingSphereFix(): void {
        this.mesh.geometry.computeBoundingSphere(); 
        
        const patchDiagonalHalf = Math.sqrt(this.config.sideLength ** 2 * 2) / 2;
        
        const sphere = this.mesh.geometry.boundingSphere;
        if (sphere) {
            sphere.radius = patchDiagonalHalf;
        }
    }

    public update(deltaTime: number): void {
        this.grassShader.update(deltaTime);
    }
}