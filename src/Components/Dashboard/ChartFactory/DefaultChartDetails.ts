import { DateTime } from "luxon"
import { ChartType } from "chart.js"

export const DefaultChartDetails = (chartName: string) => {
  return {
    name: chartName,
    srcUrl: "",
    dataKey: "",
    labelKey: "",
    chartType: "bar" as ChartType,
    method: "GET",
  }
}