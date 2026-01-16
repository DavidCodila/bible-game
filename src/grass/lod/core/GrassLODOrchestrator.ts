import GrassPool from '../services/GrassPool';
import { GrassLODPatch } from '../model/GrassLODPatch';
import { GrassPatch } from '../../patch/GrassPatch';
import type { LODLevel, Transition } from '../model/types';
import type { GameObjectsController } from '../../../app/GameObjectsController';

export class GrassLODOrchestrator {
    private activeTransitions: Map<string, Transition> = new Map();
    private readonly transitionSpeed: number = 0.8; 
    private gameObjectsController: GameObjectsController;

    constructor(gameObjectsController: GameObjectsController) {
        this.gameObjectsController = gameObjectsController;
    }

    public beginSwap(lodPatch: GrassLODPatch, targetLevel: LODLevel): void {
        if (this.activeTransitions.has(lodPatch.id)) return;

        const incomingPatch = GrassPool.getPatch(targetLevel);
        
        incomingPatch.setDissolve(0.0); 
        incomingPatch.mesh.position.copy(lodPatch.worldPosition);
        incomingPatch.mesh.renderOrder = lodPatch.mesh.renderOrder;

        this.gameObjectsController.add(incomingPatch);
        
        this.activeTransitions.set(lodPatch.id, {
            outgoing: lodPatch.currentPatch,
            incoming: incomingPatch,
            outgoingLevel: lodPatch.currentLODLevel,
            targetLevel: targetLevel,
            lodPatchRef: lodPatch,
            progress: 0
        });
    }

    public update(deltaTime: number): void {
        if (this.activeTransitions.size === 0) return;

        this.activeTransitions.forEach((transition, patchId) => {
            transition.progress += deltaTime * this.transitionSpeed;

            if (transition.progress >= 1.0) {
                this.finalizeSwap(patchId, transition);
            } else {
                transition.incoming.setDissolve(transition.progress);
                transition.outgoing.setDissolve(1.0 - transition.progress);
            }
        });
    }

    public isTransitioning(patchId: string): boolean {
        return this.activeTransitions.has(patchId);
    }

    private finalizeSwap(patchId: string, transition: Transition): void {
        transition.incoming.setDissolve(1.0);
        transition.lodPatchRef.swapPatch(transition.incoming, transition.targetLevel);
        
        this.removeOldPatch(transition.outgoing);
        
        GrassPool.returnPatch(transition.outgoing, transition.outgoingLevel);
        
        this.activeTransitions.delete(patchId);
    }

    private removeOldPatch(patch: GrassPatch): void {
        this.gameObjectsController.remove(patch);
    }
}