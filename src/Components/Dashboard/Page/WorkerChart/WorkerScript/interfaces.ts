import { ChartData } from "chart.js";

export interface FetchDataDTO {
  srcUrl: string,
  dataKey: string,
  method: string,
  labelKey: string,
  from: number,
  to: number,
  select?: string,
  where?: string,
  group?: string,
  order?: string,
  limit?: string,
}

export interface FetchDatasetResponse {
  labels: string[],
  data: string[],
  error?: Error,
  label: string,
}

export interface WorkerResponse {
  chartData: ChartData,
  error?: Error
}