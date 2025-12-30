import type { DisposableObject, InputState } from "./types";

export class InputManager implements DisposableObject{
    private domElement : HTMLElement;
    private inputState: InputState = {
        mouseDeltaX: 0, mouseDeltaY: 0, isWPressed: false, isSPressed: false,  isAPressed: false, isDPressed: false
    };

    constructor(domElement: HTMLElement) {
        this.domElement = domElement;
        this.setupEventListeners(domElement);
    }

    private setupEventListeners(domElement: HTMLElement): void {
        domElement.addEventListener('click', this.handlePointerLockRequest);
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    private handlePointerLockRequest = (): void => {
        this.domElement.requestPointerLock()
    }

    private handleMouseMove = (mouseEvent: MouseEvent): void => {
        if (document.pointerLockElement === this.domElement) {
            this.inputState.mouseDeltaX += mouseEvent.movementX; 
            this.inputState.mouseDeltaY += mouseEvent.movementY;
        }
    }

    public resetDeltas(): void {
        this.inputState.mouseDeltaX = 0;
        this.inputState.mouseDeltaY = 0;
    }
    
    public get mouseDeltaX(): number { return this.inputState.mouseDeltaX; }
    public get mouseDeltaY(): number { return this.inputState.mouseDeltaY; }
    public get mouseHasNotMoved(): boolean { return this.inputState.mouseDeltaX === 0 && this.inputState.mouseDeltaY === 0}

    dispose(): void {
        this.domElement.removeEventListener('click', this.handlePointerLockRequest);
        document.removeEventListener('mousemove', this.handleMouseMove);

        if (document.pointerLockElement === this.domElement) {
            document.exitPointerLock();
        }
        
        console.log("InputManager: Event listeners removed and pointer lock released.");
    }
}