const WIDTH = 600
const HEIGHT = 200
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2

const canvas = document.getElementById('chart')
const data = [
  [0, 0],
  [200, 200],
  [400, 50],
  [600, 400]
]


function computeBoundaries(data) {
  let min = data[0][1]
  let max = data[0][1]
  for (let [, y] of data) {
    if (y < min) min = y
    if (y > max) max = y
  }

  return [min, max]
}

const [yMin, yMax] = computeBoundaries(data)
const yRatio = VIEW_HEIGHT / (yMax - yMin)


function chart(canvas, data) {
  const ctx = canvas.getContext('2d')
  canvas.style.width = WIDTH + 'px'
  canvas.style.height = HEIGHT + 'px'
  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT

  ctx.beginPath()
  let step = VIEW_HEIGHT / ROWS_COUNT
  let textStep = (yMax - yMin) / ROWS_COUNT

  ctx.strokeStyle = '#bbb'
  ctx.font = '20px Arial'
  ctx.fillStyle = '#222'

  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = step * i
    const text = yMax - i * textStep
    ctx.fillText(text, 5, y + PADDING - 10)
    ctx.moveTo(0, y + PADDING)
    ctx.lineTo(DPI_WIDTH, y + PADDING)
  }
  ctx.stroke()
  ctx.closePath()


  ctx.beginPath()
  ctx.lineWidth = 4
  ctx.strokeStyle = 'violet'
  for (const [x, y] of data) {
    ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRatio)
  }
  ctx.stroke()
  ctx.closePath()
}


chart(canvas, data)
