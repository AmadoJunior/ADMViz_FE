import { DateTime } from "luxon"
import { ChartType } from "../../../Context/DashboardContext/interfaces";

export const DefaultChartDetails = (chartName: string) => {
  return {
    name: chartName,
    srcUrl: "",
    dataKey: "",
    labelKey: "",
    chartType: ChartType.BAR,
    method: "GET",
    apiKey: "",
    fromDate: 0,
    toDate: DateTime.now().toMillis(),
  }
  
}