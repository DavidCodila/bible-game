// --- IN src/GrassPatch.ts (The Orchestrator) ---

import * as THREE from 'three';
import { GrassGeometryFactory } from './GrassGeometryFactory'; 
import { GrassDataGenerator } from './GrassDataGenerator'; // NEW
import { BladeDensityOcclusion } from './BladeDensityOcclusion'; // NEW
import type { AODensityConfig } from "./grass/types";

/**
 * The orchestrator class. Manages Three.js resources (Mesh, Material, Shader) 
 * and delegates heavy attribute calculation to dedicated utilities.
 */
export class GrassPatch {
    public mesh: THREE.InstancedMesh;
    public material: THREE.ShaderMaterial;
    
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
    
    // --- SHADERS (Unchanged - uses the cleaner instanceBendX/Z) ---
    // ... (Vertex Shader and Fragment Shader content remains the same)
    private vertexShader = `
        attribute vec3 instanceOffset;
        attribute float instanceYAxisRotation;
        attribute float instanceScaleY;
        attribute float instanceBendX;
        attribute float instanceBendZ;
        attribute vec3 instanceColor;
        attribute float instanceAmbientOcclusion;
        uniform float time;
        uniform float inverseBladeHeight;
        varying vec3 vColor;
        varying float vHeightProgress;
        varying float vAmbientOcclusion;
    
        vec2 rotate2D(in vec2 point, in float angle){
            float sine = sin(angle);
            float cosine = cos(angle);
            return vec2(cosine * point.x - sine * point.y, sine * point.x + cosine * point.y);
        }
    
        void main(){
            vec3 transformedPosition = position;
    
            transformedPosition.y *= instanceScaleY;
    
            float heightProgress = position.y * inverseBladeHeight;
            vHeightProgress = heightProgress;
    
            float windEffect = sin(time * 0.8 + instanceOffset.x * 1.5 + instanceOffset.z * 1.2) * 0.05;
            float bendBias = pow(heightProgress, 1.6);
    
            transformedPosition.z += (instanceBendZ + windEffect) * bendBias;
            transformedPosition.x += (instanceBendX) * bendBias;
    
            vec2 rotatedAroundYAxis = rotate2D(vec2(transformedPosition.x, transformedPosition.z), instanceYAxisRotation);
            transformedPosition.x = rotatedAroundYAxis.x;
            transformedPosition.z = rotatedAroundYAxis.y;
    
            vec4 worldPosition = modelMatrix * vec4(transformedPosition + vec3(instanceOffset.x, 0.0, instanceOffset.z), 1.0);
    
            vColor = instanceColor;
            vAmbientOcclusion = instanceAmbientOcclusion;
    
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `;

    private fragmentShader = `
        varying vec3 vColor;
        varying float vHeightProgress;
        varying float vAmbientOcclusion;
        uniform vec3 sunDirection;

        void main(){
            float sunExposure = 0.3 + 0.7 * vHeightProgress; 
            float directionalLighting = 0.9 + 0.1 * sunDirection.x; 
            float baseAmbientOcclusion = mix(0.5, 1.0, pow(vHeightProgress, 0.5)); 
            
            float totalLighting = sunExposure * directionalLighting * baseAmbientOcclusion * vAmbientOcclusion;
            
            vec3 coolSkyTint = vec3(0.7, 0.8, 1);
            
            // DEBUG VIEW: Showing AO only 
            float combinedAO = vAmbientOcclusion * baseAmbientOcclusion;
            vec3 finalColor = vec3(combinedAO); 
            
            // FINAL COLOR: (UNCOMMENT THIS LINE WHEN READY)
            // vec3 finalColor = vColor * totalLighting * coolSkyTint;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    constructor() {
        this.totalBlades = this.bladesPerRow * this.bladesPerRow;
        this.gridSpacing = this.sideLength / this.bladesPerRow;

        const bladeGeometry = GrassGeometryFactory.createBladeGeometry();
        this.mesh = new THREE.InstancedMesh(bladeGeometry, undefined as any, this.totalBlades);
        
        this.calculateAndAssignAttributes(bladeGeometry);
        this.material = this.setupMaterial();
        this.mesh.material = this.material;
        this.applyBoundingSphereFix();
    }

    private setupMaterial(): THREE.ShaderMaterial {
        return new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
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
        bladeGeometry.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(attributes.instanceOffsets, 3));
        bladeGeometry.setAttribute("instanceYAxisRotation", new THREE.InstancedBufferAttribute(attributes.instanceYAxisRotations, 1));
        bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(attributes.instanceYAxisScales, 1));
        bladeGeometry.setAttribute("instanceBendX", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsX, 1)); 
        bladeGeometry.setAttribute("instanceBendZ", new THREE.InstancedBufferAttribute(attributes.instancePlanarBendsZ, 1)); 
        bladeGeometry.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(attributes.instanceColors, 3));
        
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