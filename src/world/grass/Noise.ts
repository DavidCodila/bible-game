import * as THREE from 'three';

export class NoiseGenerator {
  /**
   * Creates a seamless, multi-octave value noise texture suitable for wind animation.
   * Higher octaves = more detail / turbulence
   * Lower persistence = finer details dominate
   */
  public static createSeamlessNoise(
    size: number = 128,           // 128 is ok, 256 gives noticeably better detail
    octaves: number = 6,
    persistence: number = 0.30,
    lacunarity: number = 1.95,
    baseScale: number = 1.0       // global frequency multiplier
  ): THREE.DataTexture {
    const pixelCount = size * size;
    const data = new Uint8Array(pixelCount);

    // Base grid – larger than 8×8 gives better base frequency
    const gridSize = 30; // 16×16 = 256 points → good balance of detail vs speed
    const grid = new Float32Array(gridSize * gridSize);

    // Fill grid with random values in [-1, 1] range (easier for FBM)
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() * 2 - 1;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Normalized UV [0,1]
        const u = x / size;
        const v = y / size;

        let value = 0;
        let amplitude = 1;
        let frequency = baseScale;

        for (let o = 0; o < octaves; o++) {
          // Scale coordinates for this octave
          const scaledX = u * gridSize * frequency;
          const scaledY = v * gridSize * frequency;

          const ix = Math.floor(scaledX);
          const iy = Math.floor(scaledY);

          // Four corners with wrapping
          let x0 = ix % gridSize;     if (x0 < 0) x0 += gridSize;
          const x1 = (x0 + 1) % gridSize;
          let y0 = iy % gridSize;     if (y0 < 0) y0 += gridSize;
          const y1 = (y0 + 1) % gridSize;

          const fx = scaledX - ix;
          const fy = scaledY - iy;

          // Smoothstep interpolation
          const sx = fx * fx * (3 - 2 * fx);
          const sy = fy * fy * (3 - 2 * fy);

          // Sample corners
          const c00 = grid[y0 * gridSize + x0];
          const c10 = grid[y0 * gridSize + x1];
          const c01 = grid[y1 * gridSize + x0];
          const c11 = grid[y1 * gridSize + x1];

          // Interpolate
          const ix0 = c00 + sx * (c10 - c00);
          const ix1 = c01 + sx * (c11 - c01);
          const cellValue = ix0 + sy * (ix1 - ix0);

          value += cellValue * amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }

        // Normalize to roughly 0–255 range
        // FBM output is roughly [-1..1] → shift & scale
        const normalized = (value * 0.5 + 0.5) * 255;
        data[y * size + x] = Math.floor(Math.max(0, Math.min(255, normalized)));
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter; // better for distance now
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    return texture;
  }
}