import { InputManager } from "@src/app/InputManager";

describe('InputManager', () => {
    let mockDisplayElement: HTMLElement;
    let inputManager: InputManager;

    function dispatchMouseMoveWithDeltas(targetX: number, targetY: number): void {
        const mouseMoveEvent = new MouseEvent('mousemove');
        Object.defineProperties(mouseMoveEvent, {
            movementX: { value: targetX },
            movementY: { value: targetY }
        });
        document.dispatchEvent(mouseMoveEvent);
    }

    function setGlobalPointerLockElement(element: HTMLElement | null): void {
        Object.defineProperty(document, 'pointerLockElement', {
            value: element,
            configurable: true
        });
    }

    function expectInputManagerStateToBeReset(): void {
        expect(inputManager.mouseDeltaX).toBe(0);
        expect(inputManager.mouseDeltaY).toBe(0);
        expect(inputManager.mouseHasNotMoved).toBe(true);
    }

    beforeEach(() => {
        mockDisplayElement = document.createElement('div');
        mockDisplayElement.requestPointerLock = vi.fn();
        document.exitPointerLock = vi.fn();
        
        inputManager = new InputManager(mockDisplayElement);

        setGlobalPointerLockElement(mockDisplayElement);
    });

    afterEach(() => {
        inputManager.dispose();
        setGlobalPointerLockElement(null);
        vi.clearAllMocks();
    });

    it('should request pointer lock when the display element is clicked', () => {
        const clickEvent = new MouseEvent('click');
        mockDisplayElement.dispatchEvent(clickEvent);

        expect(mockDisplayElement.requestPointerLock).toHaveBeenCalled();
    });

    it('should accumulate mouse deltas when the element is the active pointerLockElement', () => {
        dispatchMouseMoveWithDeltas(12, -8);
        dispatchMouseMoveWithDeltas(3, 10);

        expect(inputManager.mouseDeltaX).toBe(15);
        expect(inputManager.mouseDeltaY).toBe(2);
        expect(inputManager.mouseHasNotMoved).toBe(false);
    });

    it('should ignore movement when a different element (or nothing) is locked', () => {
        const differentElement = document.createElement('section');

        setGlobalPointerLockElement(differentElement);
        dispatchMouseMoveWithDeltas(100, 100);
        expectInputManagerStateToBeReset();
    });

    it('should reset delta values to zero when resetDeltas is invoked', () => {
        dispatchMouseMoveWithDeltas(50, 50);

        inputManager.resetDeltas();
        expectInputManagerStateToBeReset();
    });

    it('should stop listening to mouse events after disposal', () => {
        inputManager.dispose();

        dispatchMouseMoveWithDeltas(10, 10);
        expectInputManagerStateToBeReset();
    });

    it('should release the pointer lock via document.exitPointerLock if active on dispose', () => {
        document.exitPointerLock = vi.fn();
        inputManager.dispose();

        expect(document.exitPointerLock).toHaveBeenCalled();
    });

    it('should not call document.exitPointerLock on dispose if the element is not locked', () => {
        const differentElement = document.createElement('span');

        setGlobalPointerLockElement(differentElement);

        document.exitPointerLock = vi.fn();

        inputManager.dispose();

        expect(document.exitPointerLock).not.toHaveBeenCalled();
    });
});