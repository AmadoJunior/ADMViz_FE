/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { ChartDataset } from "chart.js";
//Int
import {FetchDataDTO, WorkerResponse, FetchDatasetResponse} from "./interfaces";
import { DateTime } from "luxon";


function generateQuery(
    dateColumnKey?: string,
    from?: number,
    to?: number,
    select?: string,
    where?: string,
    group?: string,
    order?: string,
    limit?: string
  ) {
    if(dateColumnKey?.length && from !== undefined && to !== undefined){
      const startDate = DateTime.fromMillis(from).toFormat("y-LL-dd");
      const endDate = DateTime.fromMillis(to).toFormat("y-LL-dd");
      return `?${select ? `$select=${select}&` : ""}$where=${dateColumnKey} between '${startDate}T00:00:00' and '${endDate}T23:59:59'${where ? `and ${where}` : ""}${group ? `&$group=${group}` : ""}${order ? `&$order=${order}` : ""}${limit ? `&$limit=${limit}` : ""}`;
    }
    
    return `?${select ? `$select=${select}` : ""}${where ? `&$where=${where}` : ""}${group ? `&$group=${group}` : ""}${order ? `&$order=${order}` : ""}${limit ? `&$limit=${limit}` : ""}`;
  }

async function fetchDataset(
  srcUrl: string,
  dataKey: string,
  labelKey: string,
  method: string,
  dateColumnKey?: string,
  from?: number,
  to?: number,
  select?: string,
  where?: string,
  group?: string,
  order?: string,
  limit?: string,
): Promise<FetchDatasetResponse> {
  const labels = [];
  const data = [];
  let responseJson;
  let error;

  try {
    const res = await fetch(
      `${srcUrl}${generateQuery(dateColumnKey, from, to, select, where, group, order, limit)}`,
      {
        method: method,
      }
    );

    responseJson = await res.json();
    if (res.status === 200) {
      for (let point of responseJson) {
        labels.push(point?.[labelKey] || point?._id?.[labelKey]);
        data.push(point[dataKey]);
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
    label: dataKey,
  };
}

export const fetchData = async ({ srcUrl, dataKey, labelKey, method, dateColumnKey, from, to, select, where, group, order, limit }: FetchDataDTO): Promise<WorkerResponse> => {
  const datasetsArr: ChartDataset[] = [];
  const labelsSet = new Set<string>();

  let labelsArr: string[] = [];

    const { labels, data, error, label } = await fetchDataset(
      srcUrl,
      dataKey,
      labelKey,
      method,
      dateColumnKey,
      from,
      to,
      select, 
      where, 
      group, 
      order,
      limit,
    );

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
