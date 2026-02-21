import { assetPaths } from '../data/AssetPaths';
import { assetCredits } from '../data/AssetCredits';
import { CreditsManager } from '../utils/CreditsManager';

export class AssetRegistry {
    public static registerByPath(path: string): void {
        const creditKey = assetPaths[path];

        if (!creditKey) {
            console.warn(`AssetRegistry: No credit key assigned to path: ${path}`);
            return;
        }

        const attribution = assetCredits[creditKey];

        if (!attribution) {
            console.warn(`AssetRegistry: No attribution found for key: ${creditKey}`);
            return;
        }

        CreditsManager.registerAsset(attribution);
    }
}