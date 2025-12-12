import * as THREE from 'three';
import { GrassGeometryFactory } from './GrassGeometryFactory'; 

/**
 * Encapsulates all data generation, instancing, AO calculation, and setup 
 * for the entire field of grass. Uses UNIFORM RANDOM placement.
 */
export class GrassPatch {
    public mesh: THREE.InstancedMesh;
    public material: THREE.ShaderMaterial;
    
    private readonly sideLength = 10;
    private readonly bladesPerRow = 150;
    private readonly totalBlades: number;
    private readonly gridSpacing: number;
    private readonly bladeHeight = 0.4;
    
    // Shader Uniforms (will be passed to the material later)
    public shaderUniforms: { [key: string]: THREE.IUniform<any> } = {
        time: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 2, 0.5).normalize() },
        inverseBladeHeight: { value: 1.0 / this.bladeHeight }
    };
    
    // --- SHADERS (Unchanged: uses instanceBendX/Z) ---
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
            
            // DEBUG VIEW: Showing AO only (REMOVE THIS LINE FOR FINAL COLOR)
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
        
        this.calculateInstanceAttributes();
        this.material = this.setupMaterial(); // Fix 1: Assign return value
        this.mesh.material = this.material;   // Fix 2: Assign to mesh
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

    private calculateInstanceAttributes(): void {
        // --- 1. ATTRIBUTE ARRAY ALLOCATION ---
        const instanceOffsets = new Float32Array(this.totalBlades * 3);
        const instanceColors = new Float32Array(this.totalBlades * 3);
        const instanceYAxisRotations = new Float32Array(this.totalBlades);
        const instanceYAxisScales = new Float32Array(this.totalBlades);
        const instancePlanarBendsX = new Float32Array(this.totalBlades);
        const instancePlanarBendsZ = new Float32Array(this.totalBlades);
        const instanceAmbientOcclusion = new Float32Array(this.totalBlades);
        
        // --- 2. THE MAIN ATTRIBUTE FILLING LOOP (SIMPLE UNIFORM PLACEMENT) ---
        for (let xIndex = 0; xIndex < this.bladesPerRow; xIndex++) { 
            for (let zIndex = 0; zIndex < this.bladesPerRow; zIndex++) {
                const bladeIndex = xIndex * this.bladesPerRow + zIndex;
                
                // Base pos + Uniform Jitter
                // We no longer factor in a separate cluster offset.
                const xPosition = xIndex * this.gridSpacing - this.sideLength / 2 
                    + (Math.random() - 0.5) * this.gridSpacing;                           
                const zPosition = zIndex * this.gridSpacing - this.sideLength / 2 
                    + (Math.random() - 0.5) * this.gridSpacing;                           

                // Offsets (X, Y, Z position)
                instanceOffsets[bladeIndex * 3 + 0] = xPosition;
                instanceOffsets[bladeIndex * 3 + 1] = 0;
                instanceOffsets[bladeIndex * 3 + 2] = zPosition;

                // Y Axis Rotation
                instanceYAxisRotations[bladeIndex] = (Math.random() - 0.5) * (Math.PI / 2);

                // Y Axis Scale (Height variation)
                instanceYAxisScales[bladeIndex] = 0.7 + Math.random() * 1.2;

                // Bending (Magnitude and Direction)
                const leanMagnitude = 0.02 + Math.random() * 0.11;
                const leanDirection = (Math.random() - 0.5) * Math.PI / 3; 
                
                instancePlanarBendsX[bladeIndex] = leanMagnitude * Math.sin(leanDirection); 
                instancePlanarBendsZ[bladeIndex] = leanMagnitude * Math.cos(leanDirection); 

                // Color Variation
                const greenChannel = 0.25 + Math.random() * 0.35;
                const redChannel = 0.08 + Math.random() * 0.08; 
                const blueChannel = 0.03 + Math.random() * 0.05;
                instanceColors[bladeIndex * 3 + 0] = redChannel;
                instanceColors[bladeIndex * 3 + 1] = greenChannel;
                instanceColors[bladeIndex * 3 + 2] = blueChannel;
            }
        }
        
        // --- 3. AO CALCULATION (Simplified: Using only position and distance) ---
        this.calculateAmbientOcclusion(instanceAmbientOcclusion, instanceOffsets);

        // --- 4. ATTRIBUTE ASSIGNMENT ---
        const bladeGeometry = this.mesh.geometry;
        bladeGeometry.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(instanceOffsets, 3));
        bladeGeometry.setAttribute("instanceYAxisRotation", new THREE.InstancedBufferAttribute(instanceYAxisRotations, 1));
        bladeGeometry.setAttribute("instanceScaleY", new THREE.InstancedBufferAttribute(instanceYAxisScales, 1));
        bladeGeometry.setAttribute("instanceBendX", new THREE.InstancedBufferAttribute(instancePlanarBendsX, 1)); 
        bladeGeometry.setAttribute("instanceBendZ", new THREE.InstancedBufferAttribute(instancePlanarBendsZ, 1)); 
        bladeGeometry.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(instanceColors, 3));
        bladeGeometry.setAttribute("instanceAmbientOcclusion", new THREE.InstancedBufferAttribute(instanceAmbientOcclusion, 1));
    }

    // AO Calculation is simplified to remove cluster/grid complexity, maintaining only basic neighbor density.
    private calculateAmbientOcclusion(instanceAmbientOcclusion: Float32Array, instanceOffsets: Float32Array): void {
        const maximumNeighborDistance = this.gridSpacing * 2.5; 
        
        // Note: Without the spatial grid, this is O(n^2) and is SLOW for 22,500 blades.
        // I have left it simple here as the cluster logic was complex, but for production, 
        // a simple spatial hash or quadtree is needed.
        
        for (let bladeIndex = 0; bladeIndex < this.totalBlades; bladeIndex++) {
            const xPosition = instanceOffsets[bladeIndex * 3 + 0];
            const zPosition = instanceOffsets[bladeIndex * 3 + 2];
            
            let weightedDensity = 0;
            
            // This loop iterates over ALL other blades. Keep an eye on performance here!
            for (let neighborBladeIndex = 0; neighborBladeIndex < this.totalBlades; neighborBladeIndex++) {
                if (bladeIndex === neighborBladeIndex) continue;
                
                const neighborX = instanceOffsets[neighborBladeIndex * 3 + 0];
                const neighborZ = instanceOffsets[neighborBladeIndex * 3 + 2];
                
                const deltaX = xPosition - neighborX;
                const deltaZ = zPosition - neighborZ;
                const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
                
                if (distance < maximumNeighborDistance) {
                    const distanceWeight = 1.0 - (distance / maximumNeighborDistance);
                    weightedDensity += distanceWeight;
                }
            }
            
            const maxWeightedDensityForFullDarkening = 20.0;
            const densityFactor = Math.min(weightedDensity / maxWeightedDensityForFullDarkening, 1.0);
            const aoFalloff = Math.sqrt(densityFactor);

            const maximumDarkeningAmount = 0.75;
            instanceAmbientOcclusion[bladeIndex] = 1.0 - (aoFalloff * maximumDarkeningAmount);
        }
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