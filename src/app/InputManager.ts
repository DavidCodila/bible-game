import type { DisposableObject, InputState } from "./types";

export class InputManager implements DisposableObject{
    private domElement : HTMLElement;
    private inputState: InputState = {
        mouseDeltaX: 0, mouseDeltaY: 0, wKeyPressed: false, sKeyPressed: false,  aKeyPressed: false, dKeyPressed: false, spaceKeyPressed: false
    };

    constructor(domElement: HTMLElement) {
        this.domElement = domElement;
        this.setupEventListeners(domElement);
    }

    private setupEventListeners(domElement: HTMLElement): void {
        domElement.addEventListener('click', this.handlePointerLockRequest);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('keydown', (event) => this.handleKeyUpdate(event.code, true));
        document.addEventListener('keyup', (event) => this.handleKeyUpdate(event.code, false));
    }

    private handleKeyUpdate(keyCode: string, isPressed: boolean): void {
        if (!this.mouseIsLockedOnScreen()) return;
        if (keyCode === 'KeyW') this.inputState.wKeyPressed = isPressed;
        if (keyCode === 'KeyS') this.inputState.sKeyPressed = isPressed;
        if (keyCode === 'KeyA') this.inputState.aKeyPressed = isPressed;
        if (keyCode === 'KeyD') this.inputState.dKeyPressed = isPressed;
        if (keyCode === 'Space') this.inputState.spaceKeyPressed = isPressed;
    }

    public get inputStateReference(): InputState {
        return this.inputState;
    }

    private handlePointerLockRequest = (): void => {
        this.domElement.requestPointerLock()
    }

    private handleMouseMove = (mouseEvent: MouseEvent): void => {
        if (!this.mouseIsLockedOnScreen()) return;
        this.inputState.mouseDeltaX += mouseEvent.movementX; 
        this.inputState.mouseDeltaY += mouseEvent.movementY;
    }

    private mouseIsLockedOnScreen = (): boolean => {
        return document.pointerLockElement === this.domElement;
    };

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