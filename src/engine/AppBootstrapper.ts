import { assembleSystemsRegistry } from './AppFactory';
import { SystemsRegistry } from './SystemsRegistry';

export class AppBootstrapper {
    private isInitialized: boolean = false;
    private hasPressedPlay: boolean = false;
    private registry?: SystemsRegistry;

    public async load(startGame: (registry: SystemsRegistry) => void): Promise<void> {
        try {
            this.registry = await assembleSystemsRegistry();
            this.isInitialized = true;

            if (this.hasPressedPlay) {
                startGame(this.registry);
            }
        } catch (error) {
            console.error("Failed to initialize game systems:", error);
        }
    }

    public play(startGame: (registry: SystemsRegistry) => void): void {
        this.hasPressedPlay = true;

        if (this.isInitialized && this.registry) {
            startGame(this.registry);
        }
    }
}