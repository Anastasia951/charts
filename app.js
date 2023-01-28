const WIDTH = 600
const HEIGHT = 200
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2

function chart(canvas, data) {
  const ctx = canvas.getContext('2d')
  canvas.style.width = WIDTH + 'px'
  canvas.style.height = HEIGHT + 'px'
  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT

  ctx.beginPath()
  let step = VIEW_HEIGHT / ROWS_COUNT
  ctx.strokeStyle = '#bbb'
  ctx.font = '20px Arial'
  ctx.fillStyle = '#222'
  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = step * i
    ctx.fillText(DPI_HEIGHT - y, 5, y + PADDING - 10)
    ctx.moveTo(0, y + PADDING)
    ctx.lineTo(DPI_WIDTH, y + PADDING)
  }
  ctx.stroke()
  ctx.closePath()


  ctx.beginPath()
  ctx.lineWidth = 4
  ctx.strokeStyle = 'violet'
  for (const [x, y] of data) {
    ctx.lineTo(x, DPI_HEIGHT - PADDING - y)
  }
  ctx.stroke()
  ctx.closePath()
}

const canvas = document.getElementById('chart')
const data = [
  [0, 0],
  [200, 200],
  [400, 50]
]
chart(canvas, data)
