import * as THREE from 'three';

export class PositionTracker {
    private static instance: PositionTracker | undefined;

    private readonly placedPositions: THREE.Vector3[] = [];

    private constructor() {}

    public static getInstance(): PositionTracker {
        if (!PositionTracker.instance) {
            PositionTracker.instance = new PositionTracker();
        }
        return PositionTracker.instance;
    }

    public isFree(position: THREE.Vector3, minDistanceSquared: number): boolean {
        return !this.placedPositions.some(other =>
            position.distanceToSquared(other) < minDistanceSquared
        );
    }

    public register(position: THREE.Vector3): void {
        this.placedPositions.push(position.clone());
    }
}