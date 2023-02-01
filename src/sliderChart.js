import { computeBoundaries, toCoords, line, css, computeYRatio, computeXRatio } from "./utils.js"

function noop() { }

const HEIGHT = 40
const DPI_HEIGHT = HEIGHT * 2

export function sliderChart(root, data, DPI_WIDTH) {
  function setPosition(leftVal, rightVal) {
    const minWidth = WIDTH * 0.05
    const w = WIDTH - rightVal - leftVal
    if (w < minWidth) {
      css(slidingWindow, {
        width: minWidth + 'px'
      })
      return
    }

    if (leftVal < 0) {
      css(slidingWindow, { left: 0 + 'px' })
      css(left, { width: 0 + 'px' })
      return
    }
    if (rightVal < 0) {
      css(slidingWindow, { right: 0 + 'px' })
      css(right, { width: 0 + 'px' })
      return
    }

    css(slidingWindow, {
      width: w + 'px',
      left: leftVal + 'px',
      right: rightVal + 'px'
    })

    css(right, {
      width: rightVal + 'px'
    })
    css(left, {
      width: leftVal + 'px'
    })
  }
  const WIDTH = DPI_WIDTH / 2
  const canvas = root.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  let nextFn = noop
  const left = root.querySelector('[data-el="left"]')
  const right = root.querySelector('[data-el="right"]')

  const slidingWindow = root.querySelector('[data-el="window"]')
  canvas.style.width = WIDTH + 'px'
  canvas.style.height = HEIGHT + 'px'
  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT


  function mouseup() {
    document.onmousemove = null
  }
  function mousedown(e) {
    const type = e.target.dataset.type
    const dimensions = {
      left: parseInt(slidingWindow.style.left),
      right: parseInt(slidingWindow.style.right),
      width: parseInt(slidingWindow.style.width)
    }
    if (type === 'window') {
      const startX = e.pageX
      document.onmousemove = e => {
        const delta = startX - e.pageX
        if (delta === 0) return
        let left = dimensions.left - delta
        let right = dimensions.right + delta
        setPosition(left, right)
        next()
      }

    } else if (type === 'left' || type === 'right') {
      const startX = e.pageX
      document.onmousemove = e => {
        const delta = startX - e.pageX
        let left = dimensions.left
        let right = dimensions.right
        if (delta === 0) return
        if (type === 'left') {
          left = dimensions.left - delta
        } else {
          right = dimensions.right + delta
        }
        setPosition(left, right)
        next()
      }
    }
  }

  function getPosition() {
    const leftVal = parseInt(left.style.width)
    const rightVal = WIDTH - parseInt(right.style.width)

    return [Math.floor(leftVal * 100 / WIDTH), Math.floor(rightVal * 100 / WIDTH)]
  }

  root.addEventListener('mousedown', mousedown)
  document.addEventListener('mouseup', mouseup)
  const defaultWidth = WIDTH * 0.3
  setPosition(0, WIDTH - defaultWidth)
  const { colors } = data
  const [yMin, yMax] = computeBoundaries(data)
  const yRatio = computeYRatio(DPI_HEIGHT, yMax, yMin)
  const xRatio = computeXRatio(DPI_WIDTH, data.columns[0].length)
  const yData = data.columns.filter(col => data.types[col[0]] === 'line')

  yData.forEach(col => {
    const name = col[0]
    const coords = col.map(toCoords(xRatio, yRatio, DPI_HEIGHT, -10, yMin))
    coords.shift()

    line(ctx, coords, colors[name])
  })

  function next() {
    nextFn(getPosition())
  }
  return {
    subscribe(fn) {
      nextFn = fn.bind(this)
      fn(getPosition())
    },
    setTheme(theme, THEMES) {
      console.log(theme)
      css(left, {
        background: THEMES[theme].slider
      })
      css(right, {
        background: THEMES[theme].slider
      })

    }
  }
}