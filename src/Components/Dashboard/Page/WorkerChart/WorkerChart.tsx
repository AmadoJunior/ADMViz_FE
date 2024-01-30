//Deps
import React, { useMemo, useEffect, useState, useContext } from "react";
import * as Comlink from "comlink";
import toast from "react-hot-toast";

//MUI
import { Box, Skeleton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

//Components
import AbstractChart from "./AbstractChart/AbstractChart";
import ChartSettings from "./ChartSettings/ChartSettings";
import CustomIconButton from "../../../Utility/IconButton/IconButton";

//Context

//Interfaces
import {
  IChartDetails,
} from "../../../../Context/DashboardContext/interfaces";
import { ChartData, ChartType } from "chart.js";
import { DashboardContext } from "../../../../Context/DashboardContext/useDashboardContext";

//Props
type WorkerModule = typeof import('./WorkerScript/fetcherWorker.worker');

interface IWorkerChartProps {
  name?: string;
  children?: React.ReactNode;
  chartId: number;
  chartDetails: IChartDetails;
  disabled?: boolean;
}

const WorkerChart: React.FC<IWorkerChartProps> = ({
  name,
  chartId,
  chartDetails,
  disabled
}): JSX.Element => {
  //Context
  const {isUpdatingDetails} = useContext(DashboardContext);

  //Worker Status
  const [workerError, setWorkerError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //Chart Worker
  const worker = useMemo(
    () => new ComlinkWorker<WorkerModule>(new URL('./WorkerScript/fetcherWorker.worker.ts', import.meta.url)),
    []
  );

  //Data
  const [settingsActive, setSettingsActive] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  //Effects
  useEffect(() => {
    setIsLoading(isUpdatingDetails);
  }, [isUpdatingDetails]);

  useEffect(() => {
    if (
        chartDetails &&
        chartDetails.srcUrl?.length &&
        chartDetails.dataKey?.length &&
        chartDetails.labelKey?.length &&
        chartDetails.method?.length &&
        chartDetails.chartType?.length
    ) {
      console.log("Called Worker Method...");
      setIsLoading(true);
      worker.fetchData(chartDetails)
      .then((data) => {
        const { error, chartData } = data;
        if (!error) {
          setWorkerError(false);
          setErrorMsg("");
          setChartData(chartData);
          return;
        }
        throw error;
      })
      .catch((e) => {
        //Error
        setWorkerError(true);
        setErrorMsg(e.message);

        //Clear Data
        setChartData({
          labels: [],
          datasets: [],
        });

        //Notify
        toast.error("Worker Failed Fetching Data");
        
        //Debug
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      })
    } else {
      console.log("Worker Post Didnt Run");
      setSettingsActive(true);
    }
  }, [chartDetails, worker]);

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: settingsActive ? "column" : "row",
          width: "100%",
          height: "100% !important",
          padding: "20px 20px 20px 20px",
          backgroundColor: "background.default",
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "#302f2f",
          boxShadow: 6,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            left: "50%",
            padding: "5px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="overline">{name}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            position: "absolute",
            right: "8px",
            top: "8px",
            zIndex: "3 !important",
          }}
        >
          <CustomIconButton
            disabled={disabled}
            title="Settings"
            handler={() =>
              setSettingsActive(prev => !prev)
            }
          >
            <SettingsIcon fontSize="small" sx={{
              color: disabled ? "#302f2f" : "white"
            }}/>
          </CustomIconButton>
        </Box>
        <ChartSettings chartId={chartId} isActive={settingsActive} setIsActive={setSettingsActive}/>
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {!settingsActive && (
            isLoading ? (
              <Skeleton variant="rounded" sx={{
                height: "100%"
              }}/>
            ) : workerError ? (
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "background.paper",
                  padding: "10px 20px 10px 20px",
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "#302f2f",
                  textAlign: "center"
                }}
              >
                <Typography width="150px" color="error" gutterBottom>
                  Worker Error:{" "}
                </Typography>
                <Typography variant="caption">{errorMsg}</Typography>
              </Box>
            ) : (
            <AbstractChart
              type={chartDetails.chartType as ChartType}
              data={chartData}
            />
            )
          )}
        </Box>
      </Box>
  );
};

export default React.memo(WorkerChart);
