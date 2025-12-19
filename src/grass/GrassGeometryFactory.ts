import * as THREE from 'three';
import type { GrassBladeConfig } from './types';
import { defaultBladeTaper } from '../tools/GeometryUtils';

export class GrassGeometryFactory {

    public static createBladeGeometry(config: GrassBladeConfig): THREE.BufferGeometry {
        const bladeGeometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const triangleIndices: number[] = [];

        GrassGeometryFactory.loadVertices(vertices, config);
        GrassGeometryFactory.loadTriangleIndices(triangleIndices, config);

        bladeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
        bladeGeometry.setIndex(triangleIndices);
        bladeGeometry.computeVertexNormals(); 
        
        return bladeGeometry;
    }

    private static loadVertices(vertices: number[], config: GrassBladeConfig): void {
        for (let segmentIndex = 0; segmentIndex <= config.segmentsPerBlade; segmentIndex++) {
            const normalizedHeight = segmentIndex / config.segmentsPerBlade;
            const yPosition = normalizedHeight * config.bladeHeight;

            const widthScaleFactor = defaultBladeTaper(normalizedHeight);
            const currentWidth = config.bladeWidth * widthScaleFactor;

            vertices.push(-currentWidth / 2, yPosition, 0); 
            vertices.push(currentWidth / 2, yPosition, 0);  
        }
    }

    private static loadTriangleIndices(triangleIndices: number[], config: GrassBladeConfig): void {
        for (let segmentIndex = 0; segmentIndex < config.segmentsPerBlade; segmentIndex++) {
            const lowerSegmentLeftIndex = segmentIndex * 2;
            const lowerSegmentRightIndex = lowerSegmentLeftIndex + 1;
            const upperSegmentLeftIndex = lowerSegmentLeftIndex + 2;
            const upperSegmentRightIndex = lowerSegmentLeftIndex + 3;

            triangleIndices.push(lowerSegmentLeftIndex, lowerSegmentRightIndex, upperSegmentLeftIndex);            
            triangleIndices.push(lowerSegmentRightIndex, upperSegmentRightIndex, upperSegmentLeftIndex);
        }
    }
}