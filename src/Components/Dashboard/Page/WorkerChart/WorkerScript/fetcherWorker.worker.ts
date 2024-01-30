/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { ChartDataset } from "chart.js";
//Int
import {WorkerResponse, FetchDatasetResponse} from "./interfaces";
import { DateTime } from "luxon";
import { IChartDetails } from "../../../../../Context/DashboardContext/interfaces";


function generateQuery(chartDetails: IChartDetails) {
  const {select, where, group, limit, order} = chartDetails;
  if(chartDetails?.dateColumnKey?.length && chartDetails?.fromDate !== undefined && chartDetails?.toDate !== undefined){
    const startDate = DateTime.fromMillis(chartDetails?.fromDate).toFormat("y-LL-dd");
    const endDate = DateTime.fromMillis(chartDetails?.toDate).toFormat("y-LL-dd");
    return `?${select ? `$select=${select}&` : ""}$where=${chartDetails?.dateColumnKey} between '${startDate}T00:00:00' and '${endDate}T23:59:59'${where ? `and ${where}` : ""}${group ? `&$group=${group}` : ""}${order ? `&$order=${order}` : ""}${limit ? `&$limit=${limit}` : ""}`;
  }
  
  return `?${select ? `$select=${select}` : ""}${where ? `&$where=${where}` : ""}${group ? `&$group=${group}` : ""}${order ? `&$order=${order}` : ""}${limit ? `&$limit=${limit}` : ""}`;
}

async function fetchDataset(chartDetails: IChartDetails): Promise<FetchDatasetResponse> {
  const labels = [];
  const data = [];
  let responseJson;
  let error;

  try {
    const res = await fetch(
      `${chartDetails?.srcUrl}${generateQuery(chartDetails)}`,
      {
        method: chartDetails?.method,
      }
    );

    responseJson = await res.json();
    if (res.status === 200) {
      const {labelKey, dataKey} = chartDetails;
      for (let point of responseJson) {
        if(labelKey && dataKey) {
          labels.push(point?.[labelKey] || point?._id?.[labelKey]);
          data.push(point[dataKey]);
        }
      }
    } else {
      throw new Error(responseJson?.message);
    }
  } catch (err: any) {
    console.error(err);
    error = err;
  }

  return {
    labels,
    data,
    error,
    label: chartDetails?.dataKey || "Unknown",
  };
}

export const fetchData = async (chartDetails: IChartDetails): Promise<WorkerResponse> => {
  const datasetsArr: ChartDataset[] = [];
  const labelsSet = new Set<string>();

  let labelsArr: string[] = [];

    const { labels, data, error, label } = await fetchDataset(chartDetails);

    //Labels
    for (const label of labels) {
      labelsSet.add(label);
    }
    labelsArr = Array.from(labelsSet);

    //Dataset
    datasetsArr.push({
      label,
      data: data.map((point: string) => {
        return parseInt(point) || null;
      }),
    });

  return {
    chartData: {
      labels: labelsArr,
      datasets: datasetsArr,
    },
    error,
  }
};
