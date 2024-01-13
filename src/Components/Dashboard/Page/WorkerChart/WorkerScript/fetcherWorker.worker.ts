/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

//Int
import {FetchDataDTO, WorkerResponse} from "./interfaces";

async function fetchDataset(
  srcUrl: string,
  dataKey: string,
  labelKey: string,
  filter: {
    from: number,
    to: number,
  },
  auth: string,
  method: string
) {
  const labels = [];
  const data = [];
  let status;
  try {
    const res = await fetch(
      `${srcUrl}?${new URLSearchParams({ from: String(filter.from), to: String(filter.to) })}`,
      {
        method: method,
        headers: {
          authorization: `${auth}`,
        },
      }
    );
    console.log(res);
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

export const fetchData = async ({ srcUrl, dataKey, labelKey, method, filter, type, apiKey }: FetchDataDTO): Promise<WorkerResponse> => {
  const datasetsArr = [];
  const labelsSet = new Set<string>();
  let resStatus;
  let labelsArr: string[] = [];

    const { status, labels, data, label } = await fetchDataset(
      srcUrl,
      dataKey,
      labelKey,
      filter,
      apiKey,
      method
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
