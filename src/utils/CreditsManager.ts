export interface AssetAttribution {
    assetName: string;
    authorName: string;
    licenseType: string;
    sourceLink: string;
}

export class CreditsManager {
    private static attributions: AssetAttribution[] = [];

    /**
     * Registers a new asset in the project credits.
     */
    public static registerAsset(attribution: AssetAttribution): void {
        // Prevent duplicate entries
        const alreadyExists = this.attributions.some(
            (existing) => existing.sourceLink === attribution.sourceLink
        );

        if (!alreadyExists) {
            this.attributions.push(attribution);
            console.log(`📜 Credit Registered: ${attribution.assetName} by ${attribution.authorName}`);
        }
    }

    /**
     * Returns the full list of credits. Useful for UI or console logging.
     */
    public static getCredits(): AssetAttribution[] {
        return this.attributions;
    }

    /**
     * Prints a formatted list of credits to the console.
     */
    public static printToConsole(): void {
        console.group("--- PROJECT ASSET CREDITS ---");
        this.attributions.forEach((attribution, index) => {
            console.log(
                `${index + 1}. ${attribution.assetName} | Author: ${attribution.authorName} | License: ${attribution.licenseType}\nSource: ${attribution.sourceLink}`
            );
        });
        console.groupEnd();
    }
}