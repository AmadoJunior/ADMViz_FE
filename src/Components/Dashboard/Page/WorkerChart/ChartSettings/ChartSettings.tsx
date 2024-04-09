//Deps
import React, { useContext, useEffect } from "react";
import { IChartDetails } from "../../../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";
import { ChartType } from "chart.js";

//MUI
import { Box, Button, Typography, Checkbox, InputLabel } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

//Components
import DatePicker from "./DatePicker/DatePicker";
import CustomSelect from "../../../../Utility/CustomSelect/CustomSelect";
import CustomInput from "./CustomInput/CustomInput";

//Context
import { DashboardContext } from "../../../../../Context/DashboardContext/useDashboardContext";

//Props
interface IChartSettingsProps {
  children?: React.ReactNode;
  chartId: number;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChartSettings: React.FC<IChartSettingsProps> = ({
  chartId,
  isActive,
  setIsActive,
}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);

  //State
  const [chartDetails, setChartDetails] = React.useState<IChartDetails>({
    name: "",
    srcUrl: "",
    dataKey: "",
    labelKey: "",
    chartType: "bar" as ChartType,
    method: "GET",
  });
  const [dateRangeEnabled, setDateRangeEnabled] = React.useState(false);

  //Effects
  useEffect(() => {
    if (chartId) {
      const curChart = dashboardContext.getChartById(chartId);
      if (curChart) setChartDetails(curChart?.details);
    }
  }, [chartId]);

  //Event Handlers
  const handleMethod = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setChartDetails((prev) => {
      return {
        ...prev,
        method: e.target.value,
      };
    });
  };

  const handleType = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setChartDetails((prev) => {
      return {
        ...prev,
        chartType: e.target.value as ChartType,
      };
    });
  };

  const handleToggleDateRange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.checked) {
      setChartDetails((prev) => {
        return {
          ...prev,
          dateColumnKey: undefined,
          fromDate: undefined,
          toDate: undefined,
        };
      });
    }
    setDateRangeEnabled(event.target.checked);
  };

  const onSubmit = () => {
    setIsActive(false);
    if (chartDetails)
      dashboardContext.updateChartDetails(chartId, chartDetails);
  };

  const handleUpdateDetail = React.useCallback(
    <K extends keyof IChartDetails>(key: K, value: IChartDetails[K]) => {
      setChartDetails((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [chartDetails, setChartDetails]
  );

  return (
    <Box
      sx={{
        display: isActive ? "flex" : "none",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          border: "solid 1px",
          borderColor: "background.default",
          boxShadow: 6,
          padding: "20px 20px 20px 20px",
          overflowY: "scroll",
          backgroundColor: "background.paper",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomInput
            title="Chart Name"
            value={chartDetails.name}
            valueKey="name"
            setValue={handleUpdateDetail}
          ></CustomInput>
          <CustomInput
            title="Src Url"
            value={chartDetails.srcUrl}
            valueKey="srcUrl"
            setValue={handleUpdateDetail}
          ></CustomInput>
          <CustomInput
            title="Data Key"
            value={chartDetails.dataKey}
            valueKey="dataKey"
            setValue={handleUpdateDetail}
          ></CustomInput>
          <CustomInput
            title="Label Key"
            value={chartDetails.labelKey}
            valueKey="labelKey"
            setValue={handleUpdateDetail}
          ></CustomInput>
          <Box
            sx={{
              backgroundColor: "background.default",
              padding: "10px 20px 10px 20px",
              marginY: "10px",
              borderRadius: "20px",
            }}
          >
            <Typography variant="h6">Query Builder</Typography>

            <CustomInput
              title="$SELECT: "
              value={chartDetails.select}
              valueKey="select"
              setValue={handleUpdateDetail}
              optional={true}
            ></CustomInput>
            <CustomInput
              title="$WHERE:"
              value={chartDetails.where}
              valueKey="where"
              setValue={handleUpdateDetail}
              optional={true}
            ></CustomInput>
            <CustomInput
              title="$GROUP:"
              value={chartDetails.group}
              valueKey="group"
              setValue={handleUpdateDetail}
              optional={true}
            ></CustomInput>
            <CustomInput
              title="$ORDER:"
              value={chartDetails.order}
              valueKey="order"
              setValue={handleUpdateDetail}
              optional={true}
            ></CustomInput>
            <CustomInput
              title="$LIMIT:"
              value={chartDetails.limit}
              valueKey="limit"
              setValue={handleUpdateDetail}
              optional={true}
            ></CustomInput>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <CustomSelect
              title="ChartType"
              value={chartDetails?.chartType as ChartType}
              handler={handleType}
              options={["line", "bar", "radar", "pie", "doughnut", "polarArea"]}
            ></CustomSelect>
            <CustomSelect
              title="Method"
              value={chartDetails?.method}
              handler={handleMethod}
              options={["GET"]}
            ></CustomSelect>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: dateRangeEnabled ? "0px" : "10px",
            }}
          >
            <InputLabel>Date Range Selector</InputLabel>
            <Checkbox
              checked={dateRangeEnabled}
              onChange={handleToggleDateRange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Box>
          {dateRangeEnabled && (
            <>
              <CustomInput
                title="Date Column Key:"
                value={chartDetails.dateColumnKey}
                valueKey="dateColumnKey"
                setValue={handleUpdateDetail}
              ></CustomInput>

              <DatePicker
                fromDate={
                  chartDetails?.fromDate ||
                  DateTime.now().minus({ months: 1 }).toMillis()
                }
                toDate={
                  chartDetails?.toDate ||
                  DateTime.now().plus({ days: 1 }).toMillis()
                }
                setTo={(value) => handleUpdateDetail("toDate", value)}
                setFrom={(value) => handleUpdateDetail("fromDate", value)}
              ></DatePicker>
            </>
          )}
        </Box>

        <Button variant="contained" onClick={onSubmit} sx={{}}>
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(ChartSettings);
