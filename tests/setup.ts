import { vi } from 'vitest';
import * as REAL_THREE from 'three';

if (!(globalThis as any).MASTER_THREE) {
    (globalThis as any).MASTER_THREE = REAL_THREE;
}

const THREE_SANDBOX = { ...(globalThis as any).MASTER_THREE };

class MockWebGLRenderer {
    domElement = document.createElement('canvas');
    shadowMap = { enabled: false, type: 1 };
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
}

Object.defineProperty(THREE_SANDBOX, 'WebGLRenderer', {
    value: MockWebGLRenderer,
    writable: true,
    configurable: true,
    enumerable: true
});

(globalThis as any).THREE = THREE_SANDBOX;