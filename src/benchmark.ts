function buildWithPush(bladeCount: number, segments: number) {
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < bladeCount; i++) {
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const y = t;
      const width = 1 - t * t;

      vertices.push(-width, y, 0);
      vertices.push(width, y, 0);
    }
  }

  for (let i = 0; i < bladeCount; i++) {
    for (let s = 0; s < segments; s++) {
      const b = s * 2;
      indices.push(b, b + 1, b + 2);
      indices.push(b + 1, b + 3, b + 2);
    }
  }

  return { vertices, indices };
}

function buildWithPrealloc(bladeCount: number, segments: number) {
  const ringCount = segments + 1;
  const vertsPerBlade = ringCount * 2;
  const floatsPerBlade = vertsPerBlade * 3;
  const trisPerBlade = segments * 2;
  const idxPerBlade = trisPerBlade * 3;

  const vertices = new Float32Array(floatsPerBlade * bladeCount);
  const indices = new Uint32Array(idxPerBlade * bladeCount);

  let v = 0;
  let i = 0;

  for (let b = 0; b < bladeCount; b++) {
    for (let s = 0; s < ringCount; s++) {
      const t = s / segments;
      const y = t;
      const width = 1 - t * t;
      const half = width * 0.5;

      vertices[v++] = -half;
      vertices[v++] = y;
      vertices[v++] = 0;

      vertices[v++] = +half;
      vertices[v++] = y;
      vertices[v++] = 0;
    }

    for (let s = 0; s < segments; s++) {
      const lower = s * 2;
      const upper = lower + 2;

      indices[i++] = lower;
      indices[i++] = lower + 1;
      indices[i++] = upper;

      indices[i++] = lower + 1;
      indices[i++] = upper + 1;
      indices[i++] = upper;
    }
  }

  return { vertices, indices };
}

// Run benchmark
const sizes = [10_000, 20_000, 40_000, 80_000, 120_000];
const segments = 6;

for (const count of sizes) {
  const t1 = performance.now();
  buildWithPush(count, segments);
  const t2 = performance.now();

  const t3 = performance.now();
  buildWithPrealloc(count, segments);
  const t4 = performance.now();

  console.log(
    `${count} blades | push: ${(t2 - t1).toFixed(2)} ms | prealloc: ${(t4 - t3).toFixed(2)} ms`
  );
}
