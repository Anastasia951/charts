export function toDate(timestamp) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const date = new Date(timestamp)

  return `${months[date.getMonth()]} ${date.getDate()}`
}

export function isOver(mouse, x, length, dWidth) {
  if (!mouse) return false
  const width = dWidth / length
  return Math.abs(x - mouse.x) < width / 2
}

export function line(ctx, coords, color = 'violet') {
  ctx.beginPath()
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  for (const [x, y] of coords) {
    ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.closePath()
}

export function circle(ctx, [x, y], radius, color) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.fillStyle = '#fff'
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

export function computeBoundaries({ columns, types }) {
  let min
  let max

  columns.forEach(col => {
    if (types[col[0]] !== 'line') return
    if (!min) min = col[1]
    if (!max) max = col[1]
    if (col[1] < min) min = col[1]
    if (col[1] > max) max = col[1]

    for (let i = 2; i < col.length; i++) {
      min = Math.min(col[i], min)
      max = Math.max(col[i], max)
    }
  })

  return [min, max]
}