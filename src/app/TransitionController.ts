import * as THREE from 'three';

export class TransitionController {
    private static instance: TransitionController;
    
    private material!: THREE.ShaderMaterial;
    private mesh!: THREE.Mesh;
    private scene?: THREE.Scene;
    
    private readonly duration: number = 8000; 
    private isInitialised: boolean = false;

    private constructor() {}

    public static getInstance(): TransitionController {
        if (!TransitionController.instance) {
            TransitionController.instance = new TransitionController();
        }
        return TransitionController.instance;
    }

    public initialise(scene: THREE.Scene): void {
        if (this.isInitialised) return;
        this.scene = scene;

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uProgress: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uProgress;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {
                    vec2 uv = gl_FragCoord.xy / uResolution.xy;
                    float aspect = uResolution.x / uResolution.y;
                    
                    vec2 distVec = uv - 0.5;
                    distVec.x *= aspect;
                    
                    float dist = length(distVec);
                    
                    // SMOOTHING MATH:
                    // Using a power of 3 makes the opening feel 'organic' and removes the 'mechanical' look.
                    float radius = pow(uProgress, 3.0) * 2.0;
                    
                    // Antialiased edge: we use fwidth to make the circle edge 
                    // pixel-perfect regardless of screen resolution.
                    float edge = 0.02; 
                    float mask = smoothstep(radius, radius + edge, dist);
                    
                    gl_FragColor = vec4(vec3(0.0), mask);
                }
            `
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.renderOrder = 9999;
        this.mesh.frustumCulled = false;
        this.isInitialised = true;
    }

    public activate(): void {
        if (!this.isInitialised || !this.scene) return;

        this.scene.add(this.mesh);
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            // Use a normalized linear progress (0 to 1)
            const progress = Math.min(elapsed / this.duration, 1.0);

            this.material.uniforms.uProgress.value = progress;

            if (progress < 1.0) {
                requestAnimationFrame(step);
            } else {
                this.dispose();
            }
        };

        requestAnimationFrame(step);
    }

    public onResize(width: number, height: number): void {
        if (this.isInitialised) {
            this.material.uniforms.uResolution.value.set(width, height);
        }
    }

    private dispose(): void {
        if (this.scene && this.mesh) {
            this.scene.remove(this.mesh);
        }
        this.material.dispose();
        this.mesh.geometry.dispose();
        this.isInitialised = false;
    }
}