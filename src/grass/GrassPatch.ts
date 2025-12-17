// --- IN src/GrassPatch.ts (The Orchestrator) ---

import * as THREE from 'three';
import { GrassGeometryFactory } from './GrassGeometryFactory'; 
import { GrassDataGenerator } from './GrassDataGenerator'; // NEW
import { BladeDensityOcclusion } from './BladeDensityOcclusion'; // NEW
import vertexShader from './shaders/Grass.vert?raw';
import fragmentShader from './shaders/Grass.frag?raw';
import type { AODensityConfig } from "./types";

/**
 * The orchestrator class. Manages Three.js resources (Mesh, Material, Shader) 
 * and delegates heavy attribute calculation to dedicated utilities.
 */
export class GrassPatch {
    public mesh: THREE.InstancedMesh;    
    // --- Configuration Constants ---
    private readonly sideLength = 10;
    private readonly bladesPerRow = 150;
    private readonly totalBlades: number;
    private readonly gridSpacing: number;
    private readonly bladeHeight = 0.4;
    
    // Shader Uniforms (unchanged)
    public shaderUniforms: { [key: string]: THREE.IUniform<any> } = {
        time: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 2, 0.5).normalize() },
        inverseBladeHeight: { value: 1.0 / this.bladeHeight }
    };
    
    constructor() {
        this.totalBlades = this.bladesPerRow * this.bladesPerRow;
        this.gridSpacing = this.sideLength / this.bladesPerRow;

        const bladeGeometry = GrassGeometryFactory.createBladeGeometry();
        this.mesh = new THREE.InstancedMesh(bladeGeometry, undefined as any, this.totalBlades);
        
        this.calculateAndAssignAttributes(bladeGeometry);
        this.mesh.material = this.setupMaterial();
        this.applyBoundingSphereFix();
    }

    private setupMaterial(): THREE.ShaderMaterial {
        return new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true
        });
    }

    private calculateAndAssignAttributes(bladeGeometry: THREE.BufferGeometry): void {
        const generationConfig = {
            totalBlades: this.totalBlades,
            sideLength: this.sideLength,
            bladesPerRow: this.bladesPerRow,
            gridSpacing: this.gridSpacing
        };

        // --- 1. GENERATE BASE ATTRIBUTES ---
        const attributes = GrassDataGenerator.generateAttributes(generationConfig);
        
        // --- 2. CALCULATE AO (Uses the efficient Spatial Hash Grid) ---
        const aoConfig : AODensityConfig = {
            grassPatchSideLength: this.sideLength,
            maximumNeighborDistance: this.gridSpacing * 2.5,
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
        
        const patchDiagonalHalf = Math.sqrt(this.sideLength ** 2 * 2) / 2;
        
        const sphere = this.mesh.geometry.boundingSphere;
        if (sphere) {
            sphere.radius = patchDiagonalHalf;
        }
    }

    public update(deltaTime: number): void {
        this.shaderUniforms.time.value += deltaTime;
    }
}