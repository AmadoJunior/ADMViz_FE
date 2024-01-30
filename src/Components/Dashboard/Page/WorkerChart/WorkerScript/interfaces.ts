import { ChartData } from "chart.js";

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