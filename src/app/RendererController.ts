import * as THREE from 'three';

export class RendererController {
    renderer: THREE.WebGLRenderer;

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.setupRenderer();
    }

    public render(scene: THREE.Object3D, camera: THREE.Camera): void {
        this.renderer.render(scene, camera);
    }

    public resizeWindow(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private setupRenderer(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(this.renderer.domElement);
    }

    public get instanceDomElement() : HTMLCanvasElement {return this.renderer.domElement}

    public dispose(): void {
        this.renderer.dispose();
        this.renderer.forceContextLoss();

        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        console.log("RendererController released");
    }
}