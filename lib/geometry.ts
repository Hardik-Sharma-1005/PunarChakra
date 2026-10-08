export type Point = readonly [number, number]

/** Samples a quadratic Bézier into evenly spaced keyframes for motion `cx`/`cy`/`x`/`y`. */
export function sampleQuad(p0: Point, c: Point, p1: Point, samples = 24) {
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    xs.push(mt * mt * p0[0] + 2 * mt * t * c[0] + t * t * p1[0])
    ys.push(mt * mt * p0[1] + 2 * mt * t * c[1] + t * t * p1[1])
  }
  return { xs, ys }
}

export function quadPath(p0: Point, c: Point, p1: Point) {
  return `M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`
}
