export class GrassUpdateScheduler {
    private spatialFreq: number;
    private lodFreq: number;
    private frame = 0;
    constructor(spatialFreq: number, lodFreq: number) {
        this.spatialFreq = spatialFreq;
        this.lodFreq = lodFreq;
    }

    public run(
        onSpatial: () => void, 
        onLOD: () => void
    ) {
        this.frame++;
        if (this.frame % this.spatialFreq === 0) onSpatial();
        if (this.frame >= this.lodFreq) {
            this.frame = 0;
            onLOD();
        }
    }
}

