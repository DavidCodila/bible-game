import type { InputState } from "./types";

export class InputManager {
    private inputState: InputState = {
        mouseDeltaX: 0,
        mouseDeltaY: 0,
        isWPressed: false,
        isSPressed: false,
        isAPressed: false,
        isDPressed: false,
    };

    constructor(domElement: HTMLElement) {
        this.setupPointerLock(domElement);
        // Future keyboard listeners will be registered here.
    }

    private setupPointerLock(domElement: HTMLElement): void {
        domElement.addEventListener('click', () => {
            domElement.requestPointerLock();
        });

        document.addEventListener('mousemove', (mouseEvent) => {
            if (document.pointerLockElement) {
                // Accumulate raw deltas from mouse movement
                this.inputState.mouseDeltaX += mouseEvent.movementX; 
                this.inputState.mouseDeltaY += mouseEvent.movementY;
            }
        });
    }

    // Called after the App reads the deltas to prepare for the next frame
    public resetDeltas(): void {
        this.inputState.mouseDeltaX = 0;
        this.inputState.mouseDeltaY = 0;
    }
    
    // Public accessors for the App to read input state
    public get mouseDeltaX(): number { return this.inputState.mouseDeltaX; }
    public get mouseDeltaY(): number { return this.inputState.mouseDeltaY; }
    public get mouseHasNotMoved(): boolean { return this.inputState.mouseDeltaX === 0 && this.inputState.mouseDeltaY === 0}
}