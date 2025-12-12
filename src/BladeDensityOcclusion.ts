import type { AODensityConfig } from "./grass/types";
import type { Postiton } from "./grass/types";

export class BladeDensityOcclusion {
    
    private readonly CoordinatesPerBlade = 3; 
    private readonly NumberOfGridDivisions = 20; 
    private readonly LengthOfGridDivision: number; 
    private readonly config: AODensityConfig;

    constructor(config: AODensityConfig) {
        this.config = config; 
        this.LengthOfGridDivision = this.config.grassPatchSideLength / this.NumberOfGridDivisions;
    }

    /**
     * Calculates the Ambient Occlusion factor for every blade position using 
     * a Spatial Hash Grid for O(N) performance.
     */
    public calculateAO(positions: Float32Array): Float32Array {
        const totalBlades = positions.length / this.CoordinatesPerBlade; 
        const instanceAmbientOcclusion = new Float32Array(totalBlades); 
        
        // --- Configuration Setup Block ---
        const grassPatchSideLength = this.config.grassPatchSideLength;
        const maximumNeighborDistance = this.config.maximumNeighborDistance; 
        const densityRequiredForMaxAO = this.config.densityRequiredForMaxAO; 

        // Internal Grid Constants
        const ambientOcclusionGridCellsPerSide = this.NumberOfGridDivisions;
        const ambientOcclusionGridCellSize = this.LengthOfGridDivision;
        const ambientOcclusionSpatialGrid: number[][][] = []; 

        // --- PHASE 1: BUILD THE SPATIAL GRID ---
        
        const initialiseGrid = () => {
            for (let columnIndex = 0; columnIndex < ambientOcclusionGridCellsPerSide; columnIndex++) {
                ambientOcclusionSpatialGrid[columnIndex] = [];
                for (let rowIndex = 0; rowIndex < ambientOcclusionGridCellsPerSide; rowIndex++) {
                    ambientOcclusionSpatialGrid[columnIndex][rowIndex] = [];
                }
            }
        }

        //can implement y later if needed
        const getPositionFromIndex = (bladeIndex : number) : Postiton => {
            const xPosition = positions[bladeIndex * this.CoordinatesPerBlade + 0];
            const zPosition = positions[bladeIndex * this.CoordinatesPerBlade + 2];
            return {x : xPosition, y: 0, z : zPosition}
        }

        const populateGridWithBladeIndices = () => {
            for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
                const position : Postiton = getPositionFromIndex(bladeIndex)

                const aoGridColumnIndex = Math.floor((position.x + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
                const aoGridRowIndex = Math.floor((position.z + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);

                const validAoGridColumnIndex = Math.max(0, Math.min(ambientOcclusionGridCellsPerSide - 1, aoGridColumnIndex));
                const validAoGridRowIndex = Math.max(0, Math.min(ambientOcclusionGridCellsPerSide - 1, aoGridRowIndex));

                ambientOcclusionSpatialGrid[validAoGridColumnIndex][validAoGridRowIndex].push(bladeIndex);
            }
        }
        
        const querySpatialHashNeighbors = (bladeIndex: number): number[] => {
            const position : Postiton = getPositionFromIndex(bladeIndex)
            
            const aoGridColumnIndex = Math.floor((position.x + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
            const aoGridRowIndex = Math.floor((position.z + grassPatchSideLength / 2) / ambientOcclusionGridCellSize);
            
            const neighborBladeIndices: number[] = [];

            for (let neighborCellColumnOffset = -1; neighborCellColumnOffset <= 1; neighborCellColumnOffset++) {
                for (let neighborCellRowOffset = -1; neighborCellRowOffset <= 1; neighborCellRowOffset++) {
                    
                    const neighborAoGridColumnIndex = aoGridColumnIndex + neighborCellColumnOffset;
                    const nighborAoGridRowIndex = aoGridRowIndex + neighborCellRowOffset;
                    
                    const neighborIndexIsNotWithinGrid = neighborAoGridColumnIndex < 0
                        || neighborAoGridColumnIndex >= ambientOcclusionGridCellsPerSide
                        || nighborAoGridRowIndex < 0
                        || nighborAoGridRowIndex >= ambientOcclusionGridCellsPerSide;
                        
                    if (neighborIndexIsNotWithinGrid) continue;
                    
                    const indicesInCell = ambientOcclusionSpatialGrid[neighborAoGridColumnIndex][nighborAoGridRowIndex];
                    neighborBladeIndices.push(...indicesInCell);
                }
            }
            return neighborBladeIndices;
        }

        const calculateWeightedDensityFromNeighbors = (currentBladeIndex: number, neighborBladeIndices: number[]): number => {
            const position : Postiton = getPositionFromIndex(currentBladeIndex)
            let weightedDensity = 0;

            for (const neighborBladeIndex of neighborBladeIndices) {
                if (currentBladeIndex === neighborBladeIndex) continue;

                const neighborPosition : Postiton = getPositionFromIndex(currentBladeIndex)

                const deltaX = position.x - neighborPosition.x;
                const deltaZ = position.z - neighborPosition.z;
                const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
                
                if (distance < maximumNeighborDistance) {
                    const distanceWeight = 1.0 - (distance / maximumNeighborDistance);
                    weightedDensity += distanceWeight;
                }
            }
            return weightedDensity;
        }
                
        const calculateBladeAO = (bladeIndex: number) => {
            // SRP 1: Lookup
            const neighborBladeIndices = querySpatialHashNeighbors(bladeIndex);
            
            // SRP 2: Calculate Density
            const weightedDensity = calculateWeightedDensityFromNeighbors(bladeIndex, neighborBladeIndices);
            
            // SRP 3: Convert Density to Final AO Factor
            const densityFactor = Math.min(weightedDensity / densityRequiredForMaxAO, 1.0);
            const ambientOcclusionFalloff = Math.sqrt(densityFactor);

            const maximumDarkeningAmount = 0.75;
            instanceAmbientOcclusion[bladeIndex] = 1.0 - (ambientOcclusionFalloff * maximumDarkeningAmount);
        }

        const processAllBlades = () => {
            for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
                calculateBladeAO(bladeIndex);
            }
        }

        initialiseGrid();
        populateGridWithBladeIndices();
        processAllBlades();

        return instanceAmbientOcclusion;
    }
}