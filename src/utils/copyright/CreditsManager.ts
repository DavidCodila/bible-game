import type { AssetAttribution } from "../../types/AssetTypes";

export class CreditsManager {
    private static attributions: AssetAttribution[] = [];

    public static registerAsset(attribution: AssetAttribution): void {
        // Prevent duplicate entries
        const alreadyExists = this.attributions.some(
            (existing) => existing.sourceLink === attribution.sourceLink
        );

        if (!alreadyExists) {
            this.attributions.push(attribution);
            console.log(`📜 Credit Registered: ${attribution.assetName} by ${attribution.authorName}\n`);
        }
    }

    public static printToConsole(): void {
        console.group("--- PROJECT ASSET CREDITS ---");
        this.attributions.forEach((attribution, index) => {
            console.log(
                `${index + 1}. ${attribution.assetName} \nAuthor: ${attribution.authorName} \nLicense: ${attribution.licenseType}\nSource: ${attribution.sourceLink}`
            );
        });
        console.groupEnd();
    }
}