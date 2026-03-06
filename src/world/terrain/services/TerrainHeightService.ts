import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { alea } from 'seedrandom';
import { clamp } from '../../../utils/math/GeometryUtils';
import { HEIGHTMAP_RESOLUTION, WORLD_SIZE_METERS, SEED } from '../../WorldConfig';

export class TerrainHeightService {
    private static instance: TerrainHeightService;
   
    public heightTexture: THREE.DataTexture;
    private heightData: Float32Array;
    private readonly AMPLITUDE = 1.2;
            

    private constructor() {
        const pseudoRNG = alea(SEED);
        const noise2D = createNoise2D(pseudoRNG); 
        this.heightData = new Float32Array(HEIGHTMAP_RESOLUTION * HEIGHTMAP_RESOLUTION);

        for (let i = 0; i < this.heightData.length; i++) {
            const x = i % HEIGHTMAP_RESOLUTION;
            const z = Math.floor(i / HEIGHTMAP_RESOLUTION);
            
            // Normalize coordinates to 0.0 - 1.0
            const nx = x / HEIGHTMAP_RESOLUTION;
            const nz = z / HEIGHTMAP_RESOLUTION;

            // 2. LAYER THE SIMPLEX NOISE (fBm)
            // Layer 1: Big landscape shapes
            let noise = noise2D(nx * 2.0, nz * 2.0) * 1.0; 
            // Layer 2: Medium erratic bumps
            noise += noise2D(nx * 8.0, nz * 8.0) * 0.3;
            // Layer 3: Tiny rocky details
            noise += noise2D(nx * 20.0, nz * 20.0) * 0.05;

            // 3. Normalize the noise (simplex returns -1 to 1) and apply amplitude
            this.heightData[i] = noise * this.AMPLITUDE;
        }

        this.heightTexture = new THREE.DataTexture(
            this.heightData,
            HEIGHTMAP_RESOLUTION,
            HEIGHTMAP_RESOLUTION,
            THREE.RedFormat,
            THREE.FloatType
        );
        
        this.heightTexture.magFilter = THREE.LinearFilter;
        this.heightTexture.minFilter = THREE.LinearFilter;
        this.heightTexture.needsUpdate = true;
    }

    public static getInstance(): TerrainHeightService {
        if (!this.instance) this.instance = new TerrainHeightService();
        return this.instance;
    }

    public static getHeight(worldX: number, worldZ: number): number {
        const xIndex = this.worldPositionToCoordinateIndex(worldX);
        const zIndex = this.worldPositionToCoordinateIndex(worldZ);
        return this.getInstance().heightData[zIndex * HEIGHTMAP_RESOLUTION + xIndex];
    }

    private static worldPositionToCoordinateIndex(position: number) : number {
        let index = ((position + WORLD_SIZE_METERS / 2) / WORLD_SIZE_METERS) * (HEIGHTMAP_RESOLUTION - 1);
        index = clamp(Math.round(index), 0, HEIGHTMAP_RESOLUTION - 1);
        return index;
    }
}