//Deps
import React, { createContext, useState } from "react";
import toast from "react-hot-toast";

//Interfaces
import {
  IChart,
  IChartDetails,
  IChartPosition,
  ChartPosition,
  IDashboardContext,
} from "./interfaces";

//Context
export const DashboardContext = createContext<IDashboardContext>({
  //State
  userId: 0,
  dashboardId: 0,
  name: "",
  charts: [],
  isLocked: false,
  isUpdatingDetails: false,

  //Setters
  setDashboardId: () => {},
  setName: () => {},
  setCharts: () => {},
  toggleLocked: () => {},

  //Helpers
  updateChartDetails: (
    chartId: number,
    chartDetails: IChartDetails
  ): Promise<void> => Promise.reject(),
  updateChartPosition: (
    chartId: number,
    chartPosition: IChartPosition
  ): Promise<void> => Promise.reject(),
  insertChart: (
    chartDetails: IChartDetails,
    chartPosition?: ChartPosition
  ): Promise<void> => Promise.reject(),
  removeChart: (chartId: number): Promise<void> => Promise.reject(),
  getCharts() {},
  getChartById(chartId: number) {
    return undefined;
  },
});

//JSON
import { demoCharts } from "../../Demo/demoCharts";

interface IDashboardContextHookProps {
  userId: number;
  dashboardId: number;
  dashboardName: string;
}

const useDashboardContext = (
  props: IDashboardContextHookProps
): IDashboardContext => {
  //State
  const [isLocked, setIsLocked] = useState(true);
  const [userId, setUserId] = useState(props.userId);
  const [dashboardId, setDashboardId] = useState<number>(props.dashboardId);
  const [name, setName] = useState<string>(props.dashboardName);
  const [charts, setCharts] = useState<IChart[]>([]);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  //Methods
  const updateChartDetails = (
    chartId: number,
    chartDetails: IChartDetails
  ): Promise<void> => {
    setIsUpdatingDetails(true);
    return fetch(`/api/dashboards/${dashboardId}/charts/${chartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chartDetails),
    })
      .then((res) => {
        if (res.status === 200) {
          setCharts((prev) => {
            const updatedCharts = prev.map((chart) => {
              if (chart.chartId === chartId) {
                return { ...chart, details: chartDetails };
              }
              return chart;
            });
            return updatedCharts;
          });
        } else {
          throw new Error(`Failed Updating Chart Details: ${res.status}`);
        }
      })
      .catch((e) => {
        toast.error(`Failed Updating Chart Details`);
        console.error(e);
        throw e;
      })
      .finally(() => {
        setIsUpdatingDetails(false);
      });
  };

  const updateChartPosition = (
    chartId: number,
    chartPosition: IChartPosition
  ): Promise<void> => {
    setCharts((prev) => {
      const updatedCharts = prev.map((chart) => {
        if (chart.chartId === chartId) {
          return { ...chart, position: chartPosition };
        }
        return chart;
      });
      return updatedCharts;
    });

    return fetch(`/api/dashboards/${dashboardId}/charts/${chartId}/position`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chartPosition),
    })
      .then((res) => {
        if (res.status !== 200)
          throw new Error(`Failed Updating Chart Details: ${res.status}`);
      })
      .catch((e) => {
        toast.error(`Failed Updating Chart Position`);
        console.error(e);
        throw e;
      });
  };

  const insertChart = (
    chartDetails: IChartDetails,
    chartPosition?: ChartPosition
  ): Promise<void> => {
    return fetch(`/api/dashboards/${dashboardId}/charts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...chartDetails,

        position: chartPosition,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 406) {
          toast.error(`Chart Limit Reached`);
        }
        throw new Error(`Failed Inserting Chart: ${res.status}`);
      })
      .then((data) => {
        if (data) {
          getCharts();
        } else {
          throw new Error(
            `Failed Extracting Inserted Chart: ${JSON.stringify(data, null, 1)}`
          );
        }
      })
      .catch((e) => {
        toast.error(`Failed Inserting Chart`);
        console.error(e);
        throw e;
      });
  };

  const removeChart = (chartId: number): Promise<void> => {
    return fetch(`/api/dashboards/${dashboardId}/charts/${chartId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 200) {
          setCharts((prev) =>
            prev.filter((chart) => chart.chartId !== chartId)
          );
        } else {
          throw new Error(`Failed Removing Chart: ${res.status}`);
        }
      })
      .catch((e) => {
        toast.error(`Failed Removing Chart`);
        console.error(e);
        throw e;
      });
  };

  const getChartById = (chartId: number): IChart | undefined => {
    return charts.find((chart) => chart.chartId === chartId);
  };

  const toggleLocked = () => {
    setIsLocked((prev) => !prev);
  };

  const getCharts = () => {
    fetch(`/sdr/dashboards/${dashboardId}/charts`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error(`Failed Fetching Charts: ${res.status}`);
      })
      .then((data) => {
        if (data?.["_embedded"]?.["charts"]) {
          setCharts(
            data?.["_embedded"]?.["charts"].map(
              (chart: {
                id: number;
                name: string;
                srcUrl: string;
                dataKey: string;
                labelKey: string;
                chartType: string;
                method: string;
                select?: string;
                where?: string;
                group?: string;
                order?: string;
                limit?: string;
                dateColumnKey: string;
                fromDate: number;
                toDate: number;
                position: IChartPosition;
              }) => {
                return {
                  chartId: chart?.id,
                  details: {
                    name: chart?.name,
                    srcUrl: chart?.srcUrl,
                    dataKey: chart?.dataKey,
                    labelKey: chart?.labelKey,
                    chartType: chart?.chartType,
                    method: chart?.method,
                    select: chart?.select,
                    where: chart?.where,
                    group: chart?.group,
                    order: chart?.order,
                    limit: chart?.limit,
                    dateColumnKey: chart?.dateColumnKey,
                    fromDate: chart?.fromDate,
                    toDate: chart?.toDate,
                  },
                  position: chart?.position,
                };
              }
            )
          );
          return;
        }
        throw new Error(
          `Failed Extracting Fetched Charts: ${JSON.stringify(data, null, 1)}`
        );
      })
      .catch((e) => {
        toast.error(`Failed Fetching Charts`);
        console.error(e);
      });
  };

  React.useEffect(() => {
    if (userId && dashboardId) {
      getCharts();
    } else {
      setCharts(demoCharts);
    }
  }, [userId, dashboardId]);

  return {
    //State
    userId,
    dashboardId,
    name,
    charts,
    isLocked,
    isUpdatingDetails,

    //Setters
    setDashboardId,
    setName,
    setCharts,
    toggleLocked,

    //Helpers
    updateChartDetails,
    updateChartPosition,
    insertChart,
    removeChart,
    getCharts,
    getChartById,
  };
};

export default useDashboardContext;
