import { computeBoundaries, toCoords, line } from "./utils.js"

const HEIGHT = 40
const DPI_HEIGHT = HEIGHT * 2


export function sliderChart(root, data, DPI_WIDTH) {
  function clear() {
    ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT)
  }

  const WIDTH = DPI_WIDTH / 2
  const canvas = root.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  canvas.style.width = WIDTH + 'px'
  canvas.style.height = HEIGHT + 'px'
  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT


  clear(ctx)
  const { colors } = data
  const [yMin, yMax] = computeBoundaries(data)
  const yRatio = DPI_HEIGHT / (yMax - yMin)
  const xRatio = DPI_WIDTH / (data.columns[0].length - 2)
  const yData = data.columns.filter(col => data.types[col[0]] === 'line')

  yData.forEach(col => {
    const name = col[0]
    const coords = col.map(toCoords(xRatio, yRatio, DPI_HEIGHT, -10))
    coords.shift()

    line(ctx, coords, colors[name])
  })
}