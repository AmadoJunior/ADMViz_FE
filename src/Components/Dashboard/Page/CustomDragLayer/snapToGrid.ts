export function snapToGrid(x: number, y: number, stepSize: number): [number, number] {
  const snappedX = Math.round(x / stepSize) * stepSize
  const snappedY = Math.round(y / stepSize) * stepSize
  return [snappedX, snappedY]
}
