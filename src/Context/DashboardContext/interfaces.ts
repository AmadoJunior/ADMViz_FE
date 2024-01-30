export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
  DOUGHTNUT = "doughnut",
  POLARAREA = "polarArea",
  RADAR = "radar",
}

export interface IChartPosition {
  id: number,
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ChartPosition = Omit<IChartPosition, "id">;

export interface IChartDetails {
  name?: string;
  srcUrl?: string;
  select?: string;
  where?: string;
  group?: string;
  order?: string;
  limit?: string;
  dataKey?: string;
  labelKey?: string;
  chartType: string;
  method: string;
  dateColumnKey?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IChart {
  chartId: number;
  details: IChartDetails;
  position: IChartPosition;
}

export interface IDashboardContext {
  //State
  userId: number,
  dashboardId: number,
  name: string,
  charts: IChart[],
  isLocked: boolean,
  isUpdatingDetails: boolean,

  //Setters
  setDashboardId: React.Dispatch<React.SetStateAction<number>>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setCharts: React.Dispatch<React.SetStateAction<IChart[]>>,
  
  //Helpers
  insertChart: (chartDetails: IChartDetails, chartPosition?: ChartPosition) => Promise<void>,
  removeChart: (chartId: number) => Promise<void>,
  updateChartDetails: (chartId: number, chartDetails: IChartDetails) => Promise<void>,
  updateChartPosition: (chartId: number, chartPosition: IChartPosition) => Promise<void>,
  getCharts: (demo: boolean) => void,
  getChartById: (chartId: number) => IChart | undefined ,
  toggleLocked: () => void,
}