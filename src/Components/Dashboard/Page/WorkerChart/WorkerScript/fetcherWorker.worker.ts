/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

//Int
import {FetchDataDTO, WorkerResponse} from "./interfaces";
import { DateTime } from "luxon";

function generateQuery(
    filter: {
      from: number,
      to: number,
    },
    select?: string,
    where?: string,
    group?: string,
    limit?: string
  ) {
    const startDate = DateTime.fromMillis(filter.from).toFormat("y-LL-dd");
    const endDate = DateTime.fromMillis(filter.to).toFormat("y-LL-dd");
    return `?${select ? `$select=${select}&` : ""}$where=crash_date between '${startDate}T00:00:00' and '${endDate}T23:59:59'${where ? `and ${where}` : ""}${group ? `&$group=${group}` : ""}${limit ? `&$limit=${limit}` : ""}`;
  }

async function fetchDataset(
  srcUrl: string,
  dataKey: string,
  labelKey: string,
  filter: {
    from: number,
    to: number,
  },
  method: string,
  select?: string,
  where?: string,
  group?: string,
  limit?: string,
) {
  const labels = [];
  const data = [];
  let status;
  try {
    const res = await fetch(
      `${srcUrl}${generateQuery(filter, select, where, group, limit)}`,
      {
        method: method,
      }
    );
    
    status = res.status;
    if (status !== 200) {
      throw new Error(String(status));
    }

    const json = await res.json();
    for (let point of json) {
      labels.push(point?.[labelKey] || point?._id?.[labelKey]);
      data.push(point[dataKey]);
    }
  } catch (err: any) {
    console.log("FROM WORKER: ", err?.message);
    return {
      status: err.message,
      labels,
      data,
      label: dataKey,
    };
  }

  return {
    status,
    labels,
    data,
    label: dataKey,
  };
}

export const fetchData = async ({ srcUrl, dataKey, labelKey, method, filter, type, select, where, group, limit }: FetchDataDTO): Promise<WorkerResponse> => {
  const datasetsArr = [];
  const labelsSet = new Set<string>();
  let resStatus;
  let labelsArr: string[] = [];

    const { status, labels, data, label } = await fetchDataset(
      srcUrl,
      dataKey,
      labelKey,
      filter,
      method,
      select, 
      where, 
      group, 
      limit,
    );
    
    //Status
    resStatus = status;

    //Labels
    for (const label of labels) {
      labelsSet.add(label);
    }
    labelsArr = Array.from(labelsSet);

    //Dataset
    datasetsArr.push({
      label,
      data,
    });

  return {
    status: resStatus,
    chartData: {
      labels: labelsArr,
      datasets: datasetsArr,
    },
  }
};
