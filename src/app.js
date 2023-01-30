import { chart } from "./chart.js"
import { getChartData } from "./data.js"
const graphic = chart(document.getElementById('chart'), getChartData())
graphic.init()
