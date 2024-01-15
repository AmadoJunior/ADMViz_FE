import { ChartDataset } from "chart.js";
import { IChartData } from "../AbstractChart/AbstractChart";

export interface FetchDataDTO {
  srcUrl: string,
  dataKey: string,
  method: string,
  labelKey: string,
  filter: {
    from: number,
    to: number,
  },
  type: string,
  select?: string,
  where?: string,
  group?: string,
  limit?: string,
}

export interface WorkerResponse {
  status: number,
  chartData: IChartData,
}