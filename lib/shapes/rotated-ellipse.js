import random, { normal } from '../random'

import rasterize from '../rasterize'
import Scanline from '../scanline'
import Shape from './shape'

export default class RotatedEllipse extends Shape {
  constructor (opts) {
    super(opts)
    if (!opts) return

    this.x = random.int(0, this.width - 1)
    this.y = random.int(0, this.height - 1)

    this.rx = random.int(1, 32)
    this.ry = random.int(1, 32)

    this.angle = random.float() * 360
  }

  copy () {
    const shape = new RotatedEllipse()
    shape.width = this.width
    shape.height = this.height
    shape.x = this.x
    shape.y = this.y
    shape.rx = this.rx
    shape.ry = this.ry
    shape.angle = this.angle
    return shape
  }

  mutate () {
    const { width, height } = this
    const shape = this.copy()
    const m = 16

    switch (random.int(0, 2)) {
      case 0:
        shape.x = Math.max(0, Math.min(width - 1, (shape.x + normal() * m)))
        shape.y = Math.max(0, Math.min(height - 1, (shape.y + normal() * m)))
        break

      case 1:
        shape.rx = Math.max(1, Math.min(width - 1, (shape.rx + normal() * m)))
        shape.ry = Math.max(1, Math.min(height - 1, (shape.ry + normal() * m)))
        break

      case 2:
        shape.angle = shape.angle + normal() * m
        break
    }

    return shape
  }

  rasterize () {
    const points = this.getPoints()
    const lines = rasterize(points)
    return Scanline.filter(lines, this.width, this.height)
  }

  getPoints (numPoints = 20) {
    const { x, y, rx, ry, angle } = this
    const points = []
    const rads = angle * Math.PI / 180.0
    const c = Math.cos(rads)
    const s = Math.sin(rads)

    for (let i = 0; i < numPoints; ++i) {
      const rot = ((360.0 / numPoints) * i) * (Math.PI / 180.0)
      const crx = rx * Math.cos(rot)
      const cry = ry * Math.sin(rot)

      const tx = (crx * c - cry * s + x) | 0
      const ty = (crx * s + cry * c + y) | 0

      points.push({ x: tx, y: ty })
    }

    return points
  }

  draw (ctx) {
    throw new Error('TODO')
  }

  toSVG (attrs = '') {
    // TODO: native rotated ellipse will produce smaller and smoother results
    const points = this.getPoints()
      .map((point) => `${point.x} ${point.y}`)
      .join(' ')

    return (
      `<polygon ${attrs} points="${points}" />`
    )
  }
}
