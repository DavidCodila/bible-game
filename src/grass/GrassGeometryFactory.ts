import * as THREE from 'three';

const DEFAULT_BLADE_WIDTH = 0.05;
const DEFAULT_BLADE_HEIGHT = 0.4;
const DEFAULT_SEGMENT_COUNT = 6;

// Helper function to taper the width (1.0 at base, 0.0 at tip)
const defaultBladeTaper = (normalizedHeight: number): number => 1.0 - (normalizedHeight * normalizedHeight);

/**
 * Static factory to create the base BufferGeometry for a single grass blade.
 * Adheres to SRP: only responsible for geometry construction.
 */
export class GrassGeometryFactory {

    public static createBladeGeometry(): THREE.BufferGeometry {
        const bladeGeometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const triangleIndices: number[] = [];

        GrassGeometryFactory.loadVertices(vertices);
        GrassGeometryFactory.loadTriangleIndices(triangleIndices);

        bladeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
        bladeGeometry.setIndex(triangleIndices);
        bladeGeometry.computeVertexNormals(); 
        
        return bladeGeometry;
    }

    private static loadVertices(vertices: number[]): void {
        for (let segmentIndex = 0; segmentIndex <= DEFAULT_SEGMENT_COUNT; segmentIndex++) {
            const normalizedHeight = segmentIndex / DEFAULT_SEGMENT_COUNT;
            const yPosition = normalizedHeight * DEFAULT_BLADE_HEIGHT;

            const widthScaleFactor = defaultBladeTaper(normalizedHeight);
            const currentWidth = DEFAULT_BLADE_WIDTH * widthScaleFactor;

            // Vertices are generated in the X/Y plane
            vertices.push(-currentWidth / 2, yPosition, 0); 
            vertices.push(currentWidth / 2, yPosition, 0);  
        }
    }

    private static loadTriangleIndices(triangleIndices: number[]): void {
        for (let segmentIndex = 0; segmentIndex < DEFAULT_SEGMENT_COUNT; segmentIndex++) {
            const lowerSegmentLeftIndex = segmentIndex * 2;
            const lowerSegmentRightIndex = lowerSegmentLeftIndex + 1;
            const upperSegmentLeftIndex = lowerSegmentLeftIndex + 2;
            const upperSegmentRightIndex = lowerSegmentLeftIndex + 3;

            triangleIndices.push(lowerSegmentLeftIndex, lowerSegmentRightIndex, upperSegmentLeftIndex);            
            triangleIndices.push(lowerSegmentRightIndex, upperSegmentRightIndex, upperSegmentLeftIndex);
        }
    }
}