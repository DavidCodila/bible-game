import * as THREE from 'three';

export class NoiseGenerator {
    public static createSeamlessNoise(size: number = 128): THREE.DataTexture {
        const pixelCount = size * size;
        const data = new Uint8Array(pixelCount);

        // A small 8x8 grid of random values
        const gridSize = 8; 
        const grid = Array.from({ length: gridSize * gridSize }, () => Math.random() * 255);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Calculate position within the grid
                const gridX = (x / size) * gridSize;
                const gridY = (y / size) * gridSize;
                
                // Get the four surrounding grid points
                const x0 = Math.floor(gridX);
                const x1 = (x0 + 1) % gridSize; // WRAP around to 0
                const y0 = Math.floor(gridY);
                const y1 = (y0 + 1) % gridSize; // WRAP around to 0

                // Get the local fractional coordinates (0 to 1)
                const fractionalX = gridX - x0;
                const fractionalY = gridY - y0;

                // Apply Smoothstep (Hermite) interpolation: 3t^2 - 2t^3
                // This removes the "linear spikes" that look like electric shocks
                const smoothX = fractionalX * fractionalX * (3 - 2 * fractionalX);
                const smoothY = fractionalY * fractionalY * (3 - 2 * fractionalY);

                // Sample the 4 corners of the grid cell
                const topLeft = grid[y0 * gridSize + x0];
                const topRight = grid[y0 * gridSize + x1];
                const bottomLeft = grid[y1 * gridSize + x0];
                const bottomRight = grid[y1 * gridSize + x1];

                // Blend the values using our smooth curves
                const topRow = topLeft + smoothX * (topRight - topLeft);
                const bottomRow = bottomLeft + smoothX * (bottomRight - bottomLeft);
                const finalValue = topRow + smoothY * (bottomRow - topRow);

                data[y * size + x] = finalValue;
            }
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false; // Mipmaps can sometimes cause "shocks" at distance
        texture.needsUpdate = true;

        return texture;
    }
}