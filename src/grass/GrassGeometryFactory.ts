import type { GrassBladeConfig } from './types';
import { defaultBladeTaper } from '../tools/GeometryUtils';

export class GrassGeometryFactory {

    public static createBladeGeometry(config: GrassBladeConfig): THREE.BufferGeometry {
        const bladeGeometry = new THREE.BufferGeometry();

        const vertices = GrassGeometryFactory.loadVertices(config);
        const triangleIndices = GrassGeometryFactory.loadTriangleIndices(config);

        bladeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
        bladeGeometry.setIndex(triangleIndices);
        bladeGeometry.computeVertexNormals(); 
        
        return bladeGeometry;
    }

    private static loadVertices(config: GrassBladeConfig): number[] {
        const vertices: number[] = [];
        for (let segmentIndex = 0; segmentIndex <= config.segmentsPerBlade; segmentIndex++) {
            const normalizedHeight = segmentIndex / config.segmentsPerBlade;
            const yPosition = normalizedHeight * config.bladeHeight;

            const widthScaleFactor = defaultBladeTaper(normalizedHeight);
            const currentWidth = config.bladeWidth * widthScaleFactor;

            vertices.push(-currentWidth / 2, yPosition, 0); 
            vertices.push(currentWidth / 2, yPosition, 0);  
        }
        return vertices;
    }

    private static loadTriangleIndices(config: GrassBladeConfig): number[] {
        const triangleIndices: number[] = [];
        for (let segmentIndex = 0; segmentIndex < config.segmentsPerBlade; segmentIndex++) {
            const lowerSegmentLeftIndex = segmentIndex * 2;
            const lowerSegmentRightIndex = lowerSegmentLeftIndex + 1;
            const upperSegmentLeftIndex = lowerSegmentLeftIndex + 2;
            const upperSegmentRightIndex = lowerSegmentLeftIndex + 3;

            triangleIndices.push(lowerSegmentLeftIndex, lowerSegmentRightIndex, upperSegmentLeftIndex);            
            triangleIndices.push(lowerSegmentRightIndex, upperSegmentRightIndex, upperSegmentLeftIndex);
        }
        return triangleIndices;
    }
}