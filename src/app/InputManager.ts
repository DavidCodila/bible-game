import type { DisposableObject, InputMouseState, InputMovementState } from "./types";

export class InputManager implements DisposableObject{
    private domElement : HTMLElement;
    private inputMouseState: InputMouseState = {
        mouseDeltaX: 0, mouseDeltaY: 0,
    };
    private inputMovementState: InputMovementState = {
        wKeyPressed: false, sKeyPressed: false,  aKeyPressed: false, dKeyPressed: false, spaceKeyPressed: false
    }

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
        if (keyCode === 'KeyW') this.inputMovementState.wKeyPressed = isPressed;
        if (keyCode === 'KeyS') this.inputMovementState.sKeyPressed = isPressed;
        if (keyCode === 'KeyA') this.inputMovementState.aKeyPressed = isPressed;
        if (keyCode === 'KeyD') this.inputMovementState.dKeyPressed = isPressed;
        if (keyCode === 'Space') this.inputMovementState.spaceKeyPressed = isPressed;
    }

    public get inputMovementStateReference(): InputMovementState {
        return this.inputMovementState;
    }

    private handlePointerLockRequest = (): void => {
        this.domElement.requestPointerLock()
    }

    private handleMouseMove = (mouseEvent: MouseEvent): void => {
        if (!this.mouseIsLockedOnScreen()) return;
        this.inputMouseState.mouseDeltaX += mouseEvent.movementX; 
        this.inputMouseState.mouseDeltaY += mouseEvent.movementY;
    }

    private mouseIsLockedOnScreen = (): boolean => {
        return document.pointerLockElement === this.domElement;
    };

    public resetDeltas(): void {
        this.inputMouseState.mouseDeltaX = 0;
        this.inputMouseState.mouseDeltaY = 0;
    }
    
    public get mouseDeltaX(): number { return this.inputMouseState.mouseDeltaX; }
    public get mouseDeltaY(): number { return this.inputMouseState.mouseDeltaY; }
    public get mouseHasMoved(): boolean { return Object.values(this.inputMouseState).some(delta => delta !== 0); }
    public get playerHasMoved(): boolean { return Object.values(this.inputMovementState).some(isPressed => isPressed); }

    dispose(): void {
        this.domElement.removeEventListener('click', this.handlePointerLockRequest);
        document.removeEventListener('mousemove', this.handleMouseMove);

        if (document.pointerLockElement === this.domElement) {
            document.exitPointerLock();
        }
        
        console.log("InputManager: Event listeners removed and pointer lock released.");
    }
}