import { getChartData } from './data.js'
import { toDate, isOver, line, circle, computeBoundaries } from './utils.js'
const WIDTH = 600
const HEIGHT = 200
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2
const VIEW_WIDTH = DPI_WIDTH

const canvas = document.getElementById('chart')
const data = getChartData()


function xAxis(ctx, data, xRatio, { mouse }) {
  const colsCount = 6
  const step = Math.round(data.length / colsCount)
  ctx.beginPath()
  for (let i = 1; i < data.length; i++) {
    const x = i * xRatio
    if ((i - 1) % step === 0) {
      const text = toDate(data[i])
      ctx.fillText(text, x, DPI_HEIGHT - 10)
    }
    if (isOver(mouse, x, data.length, DPI_WIDTH)) {
      ctx.save()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, DPI_HEIGHT - PADDING)
      ctx.restore()
    }

  }
  ctx.stroke()
  ctx.closePath()
}

function clear(ctx) {
  ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT)
}

function chart(canvas, data) {
  const ctx = canvas.getContext('2d')
  let raf
  canvas.style.width = WIDTH + 'px'
  canvas.style.height = HEIGHT + 'px'
  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT

  const proxy = new Proxy({}, {
    set(...args) {
      const result = Reflect.set(...args)
      raf = requestAnimationFrame(paint)
      return result
    }
  })
  function paint() {
    clear(ctx)
    const { colors } = data
    const [yMin, yMax] = computeBoundaries(data)
    const yRatio = VIEW_HEIGHT / (yMax - yMin)
    const xRatio = VIEW_WIDTH / (data.columns[0].length - 2)
    const yData = data.columns.filter(col => data.types[col[0]] === 'line')

    const xData = data.columns.filter(col => data.types[col[0]] !== 'line')[0]

    yAxis(ctx, yMin, yMax)
    xAxis(ctx, xData, xRatio, proxy)
    yData.forEach(col => {
      const name = col[0]
      const coords = col.map(toCoords(xRatio, yRatio))
      coords.shift()

      line(ctx, coords, colors[name])
      for (const [x, y] of coords) {
        if (isOver(proxy.mouse, x, coords.length, DPI_WIDTH)) {
          circle(ctx, [x, y], 5, colors[name])
          break;
        }
      }
    })

  }
  function mousemove({ clientX, clientY }) {
    const { left } = canvas.getBoundingClientRect()
    proxy.mouse = {
      x: (clientX - left) * 2
    }
  }
  function mouseleave() {
    proxy.mouse = null
  }
  canvas.addEventListener('mousemove', mousemove)
  canvas.addEventListener('mouseleave', mouseleave)
  return {
    init() {
      paint()
    },
    destroy() {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', mousemove)
      canvas.removeEventListener('mouseleave', mouseleave)
    }
  }
}



function yAxis(ctx, yMin, yMax) {
  ctx.beginPath()
  let step = VIEW_HEIGHT / ROWS_COUNT
  let textStep = (yMax - yMin) / ROWS_COUNT

  ctx.lineWidth = 1
  ctx.strokeStyle = '#bbb'
  ctx.font = '20px Arial'
  ctx.fillStyle = '#222'

  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = step * i
    const text = Math.floor(yMax - i * textStep)
    ctx.fillText(text, 5, y + PADDING - 10)
    ctx.moveTo(0, y + PADDING)
    ctx.lineTo(DPI_WIDTH, y + PADDING)
  }
  ctx.stroke()
  ctx.closePath()

}

function toCoords(xRatio, yRatio) {
  return function (y, i) {
    return [
      Math.floor((i - 1) * xRatio),
      Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
    ]
  }

}


const graphic = chart(canvas, data)
graphic.init()
