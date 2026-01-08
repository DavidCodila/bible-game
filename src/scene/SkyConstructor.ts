import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { SUN_DIRECTION } from './Constants';

export class SkyConstructor {
    public static constructSky(): Sky { 
        const sky = new Sky();
        sky.scale.setScalar(450000);

        const skyUniforms = sky.material.uniforms;
        
        skyUniforms['turbidity'].value = 2.0; 
        skyUniforms['rayleigh'].value = 3.0;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.7;
        skyUniforms['sunPosition'].value.copy(SUN_DIRECTION);

        return sky;
    }   
}