import treeVertexShaderChunk from './TreeShader.vert?raw';
import { WindService } from '../../wind/WindService';

export class TreeShader {
    private windService: WindService;

    constructor(windService: WindService) {
        this.windService = windService;
    }
    
    public inject = (shader: any): void => {
        // 1. Link Uniforms
        shader.uniforms.uTime = this.windService.uniforms.uTime;
        shader.uniforms.uWindDirection = this.windService.uniforms.uWindDirection;
        shader.uniforms.uWindNoiseTexture = this.windService.uniforms.uWindNoiseTexture;
        shader.uniforms.uWindSpeed = this.windService.uniforms.uWindSpeed;
        shader.uniforms.uWindFrequency = this.windService.uniforms.uWindFrequency;
        shader.uniforms.uTreeHeight = { value: 5.8 };
        shader.uniforms.uBendingStiffener = { value: 3.1 };

        // 2. Prepend the logic to the TOP of the shader (Global scope)
        shader.vertexShader = `
            uniform float uTreeHeight;
            uniform float uBendingStiffener;

            #include <WindEngine>
            
            ${shader.vertexShader}
        `;

        // 3. Replace begin_vertex with ONLY the math/call (Local scope)
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            treeVertexShaderChunk
        );
    };
}