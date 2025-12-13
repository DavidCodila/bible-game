import type { AODensityConfig } from "./grass/types";
import type { Position } from "./grass/types";
import type { GridIndexes } from "./grass/types";

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
        
        const buildEmptyGrid = () => {
            for (let columnIndex = 0; columnIndex < ambientOcclusionGridCellsPerSide; columnIndex++) {
                ambientOcclusionSpatialGrid[columnIndex] = [];
                for (let rowIndex = 0; rowIndex < ambientOcclusionGridCellsPerSide; rowIndex++) {
                    ambientOcclusionSpatialGrid[columnIndex][rowIndex] = [];
                }
            }
        }

        //can implement y later if needed
        const getBladePosition = (bladeIndex : number) : Position => {
            return {
                x : positions[bladeIndex * this.CoordinatesPerBlade + 0], 
                y: 0, 
                z : positions[bladeIndex * this.CoordinatesPerBlade + 2]
            }
        }

        const clampGridIndexes = (grid : GridIndexes) : GridIndexes => {
            const maxIndex = ambientOcclusionGridCellsPerSide - 1;
            return {
                row : Math.max(0, Math.min(maxIndex, grid.row)),
                column : Math.max(0, Math.min(maxIndex, grid.column))
            }
        }

        const getValidGridIndexes = (position : Position) : GridIndexes => {
            return clampGridIndexes({
                row : Math.floor((position.z + grassPatchSideLength / 2) / ambientOcclusionGridCellSize),
                column : Math.floor((position.x + grassPatchSideLength / 2) / ambientOcclusionGridCellSize)
            });
        }

        const populateGridWithBladeIndices = () => {
            for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
                const position : Position = getBladePosition(bladeIndex)
                const ambientOcclusionGrid = getValidGridIndexes(position);

                ambientOcclusionSpatialGrid[ambientOcclusionGrid.column][ambientOcclusionGrid.row].push(bladeIndex);
            }
        }
        
        const getNeighborBladeIndices = (bladeIndex: number): number[] => {
            const position : Position = getBladePosition(bladeIndex)
            const ambientOcclusionGrid = getValidGridIndexes(position);
            
            const neighborBladeIndices: number[] = [];

            const isWithinGrid = (grid: GridIndexes): boolean => (
                (grid.column >= 0 && grid.column < ambientOcclusionGridCellsPerSide) && 
                (grid.row >= 0 && grid.row < ambientOcclusionGridCellsPerSide)          
            );

            const iterateThroughRowNeighboursForColumn = (neighborCellColumnOffset : number) => {
                for (let neighborCellRowOffset = -1; neighborCellRowOffset <= 1; neighborCellRowOffset++) {
                    const neighborAoGridIndexes : GridIndexes = {
                        column : ambientOcclusionGrid.column + neighborCellColumnOffset, 
                        row : ambientOcclusionGrid.row + neighborCellRowOffset
                    }

                    if (isWithinGrid(neighborAoGridIndexes)) {
                        neighborBladeIndices.push(...ambientOcclusionSpatialGrid[neighborAoGridIndexes.column][neighborAoGridIndexes.row]);
                    }
                }
            }

            const interateThroughColumnNeighbours = () => {
                for (let neighborCellColumnOffset = -1; neighborCellColumnOffset <= 1; neighborCellColumnOffset++) {
                    iterateThroughRowNeighboursForColumn(neighborCellColumnOffset);
                }
            }

            interateThroughColumnNeighbours();
            
            return neighborBladeIndices;
        }

        const calculateWeightedDensityFromNeighbors = (currentBladeIndex: number, neighborBladeIndices: number[]): number => {
            const currentPosition : Position = getBladePosition(currentBladeIndex)
            let weightedDensity = 0;

            const calculateDistanceFromCurrentBlade = (neighborPosition : Position) : number => {
                const deltaX = currentPosition.x - neighborPosition.x;
                const deltaZ = currentPosition.z - neighborPosition.z;
                const squaredDistance = deltaX * deltaX + deltaZ * deltaZ;
                if (squaredDistance > maximumNeighborDistance * maximumNeighborDistance) {
                    return -1;
                }
                else return Math.sqrt(squaredDistance);
            }

            for (const neighborBladeIndex of neighborBladeIndices) {
                if (currentBladeIndex === neighborBladeIndex) continue;

                const neighborPosition : Position = getBladePosition(neighborBladeIndex)

                const distance = calculateDistanceFromCurrentBlade(neighborPosition);
                
                if (distance === -1) continue

                incrementWeightedDensity(distance);
                
                if (weightedDensity >= densityRequiredForMaxAO) {
                    return densityRequiredForMaxAO;
                }
            }
            return weightedDensity;

            function incrementWeightedDensity(distance: number) {
                const distanceWeight = 1.0 - (distance / maximumNeighborDistance);
                weightedDensity += distanceWeight;
            }
        }
                
        const calculateBladeAO = (bladeIndex: number) => {
            const neighborBladeIndices = getNeighborBladeIndices(bladeIndex);
            
            const weightedDensity = calculateWeightedDensityFromNeighbors(bladeIndex, neighborBladeIndices);
            
            const densityFactor = weightedDensity / densityRequiredForMaxAO;
            const ambientOcclusionFalloff = Math.sqrt(densityFactor);

            const maximumDarkeningAmount = 0.75;
            instanceAmbientOcclusion[bladeIndex] = 1.0 - (ambientOcclusionFalloff * maximumDarkeningAmount);
        }

        const processAllBlades = () => {
            for (let bladeIndex = 0; bladeIndex < totalBlades; bladeIndex++) {
                calculateBladeAO(bladeIndex);
            }
        }

        buildEmptyGrid();
        populateGridWithBladeIndices();
        processAllBlades();

        return instanceAmbientOcclusion;
    }
}