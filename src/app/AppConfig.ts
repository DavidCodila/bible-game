/**
 * ENGINE EXECUTION BLUEPRINT
 * * This file acts as the "Central Nervous System" for the application. It defines 
 * the strict execution order of the engine's core controllers.
 * * DESIGN PRINCIPLES:
 * 1. ORDER MATTERS: Systems are updated and disposed of in the exact sequence 
 * defined below. (e.g., Stats must update before GameObjects).
 * * 2. FAIL-FAST CONTRACT: Every string in these lists MUST match a property 
 * name in GardenOfEdenApp. The targeted property MUST implement the 
 * required lifecycle method (.update() or .dispose()).
 * * 3. RUNTIME VALIDATION: If a property is added here but is missing from the 
 * App or lacks the necessary method, the engine will throw a TypeError 
 * immediately on startup/frame-one.
 */

/**
 * Defines the sequential update loop called every frame.
 * TARGET: Must implement .update(deltaTime: number): void
 */
export const UPDATE_ORDER = [
    'cameraController',
    'gameObjectsController'
] as const;

/**
 * Defines the teardown sequence for memory and GPU cleanup.
 * TARGET: Must implement .dispose(): void
 */
export const DISPOSE_ORDER = [
    'windowController',
    'inputManager',
    'gameObjectsController',
    'sceneController',
    'cameraController',
    'rendererController'
] as const;

export const ALL_KEYS = [...new Set([...UPDATE_ORDER, ...DISPOSE_ORDER])] as const;