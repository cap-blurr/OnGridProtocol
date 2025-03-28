"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  LineController,
  PointElement,
  LineElement,
} from "chart.js"
import { Pie, Bar, Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  LineController,
  PointElement,
  LineElement,
)

interface ChartProps {
  type: "pie" | "bar" | "line"
  data: any
  options: any
}

export function Chart({ type, data, options }: ChartProps) {
  if (type === "pie") {
    return <Pie data={data} options={options} />
  } else if (type === "bar") {
    return <Bar data={data} options={options} />
  } else if (type === "line") {
    return <Line data={data} options={options} />
  }
  return null
}

export const ChartContainer = () => {
  return null
}
export const ChartTooltip = () => {
  return null
}
export const ChartTooltipContent = () => {
  return null
}
export const ChartLegend = () => {
  return null
}
export const ChartLegendContent = () => {
  return null
}
export const ChartStyle = () => {
  return null
}

