//Deps
import React, {useContext, useEffect} from "react";
import { ChartType } from "../../../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";

//MUI
import {Box, Button, Typography, Checkbox, InputLabel} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

//Components
import DatePicker from "./DatePicker/DatePicker";
import CustomSelect from "../../../../Utility/CustomSelect/CustomSelect";
import CustomInput from "../../../../Utility/CustomInput/CustomInput";

//Context
import { DashboardContext } from "../../../../../Context/DashboardContext/useDashboardContext";

//Props
interface IChartSettingsProps {
  children?: React.ReactNode;
  chartId: number,
  isActive: boolean,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChartSettings: React.FC<IChartSettingsProps> = ({chartId, isActive, setIsActive}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);

  //State
  const [name, setName] = React.useState<string | undefined>("");
  const [srcUrl, setSrcUrl] = React.useState<string | undefined>("");
  const [dataKey, setDataKey] = React.useState<string | undefined>("");
  const [select, setSelect] = React.useState<string | undefined>();
  const [where, setWhere] = React.useState<string | undefined>();
  const [group, setGroup] = React.useState<string | undefined>();
  const [limit, setLimit] = React.useState<string | undefined>();
  const [order, setOrder] = React.useState<string | undefined>();
  const [labelKey, setLabelKey] = React.useState<string | undefined>("");
  const [method, setMethod] = React.useState<string>("GET");
  const [dateRangeEnabled, setDateRangeEnabled] = React.useState(false);
  const [dateColumnKey, setDateColumnKey] = React.useState<string | undefined>();
  const [chartType, setChartType] = React.useState<string>(ChartType.LINE);
  const [fromDate, setFromDate] = React.useState<number | undefined>();
  const [toDate, setToDate] = React.useState<number | undefined>();

  //Effects
  useEffect(() => {
    if(chartId){
      const curChart = dashboardContext.getChartById(chartId);
      if(curChart) {
        setName(curChart?.details?.name);
        setSrcUrl(curChart?.details?.srcUrl);
        setDataKey(curChart?.details?.dataKey);
        setSelect(curChart?.details?.select);
        setWhere(curChart?.details?.where);
        setGroup(curChart?.details?.group);
        setLimit(curChart?.details?.limit);
        setOrder(curChart?.details?.order);
        setLabelKey(curChart?.details?.labelKey);
        setMethod(curChart?.details?.method);
        setChartType(curChart?.details?.chartType);
        setFromDate(curChart?.details?.fromDate);
        setToDate(curChart?.details?.toDate);
      }
    }
  }, [chartId])

  const handleMethod = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setMethod(e.target.value);
  };

  const handleType = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setChartType(e.target.value);
  };

  const handleToggleDateRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!event.target.checked) {
      setDataKey(undefined);
      setFromDate(undefined);
      setToDate(undefined);
    }
    setDateRangeEnabled(event.target.checked);
  };

  const onSubmit = () => {
    setIsActive(false);
    dashboardContext.updateChartDetails(chartId, {
      name,
      srcUrl,
      dataKey,
      labelKey,
      chartType,
      method,
      select,
      where,
      group,
      limit,
      order,
      dateColumnKey,
      fromDate,
      toDate
    })
  };

  return (
    <Box sx={{
      display: isActive ? "flex" : "none",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
      zIndex: 2
    }}>
    
      <Box sx={{
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
        justifyContent: "space-between"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column"
        }}>
        <CustomInput 
            title="Chart Name"
            value={name}
            setValue={setName}
        ></CustomInput>
        <CustomInput 
            title="Src Url"
            value={srcUrl}
            setValue={setSrcUrl}
        ></CustomInput>
        <CustomInput 
            title="Data Key"
            value={dataKey}
            setValue={setDataKey}
        ></CustomInput>
        <CustomInput 
            title="Label Key"
            value={labelKey}
            setValue={setLabelKey}
        ></CustomInput>
        <Box sx={{
          backgroundColor: 'background.default',
          padding: "10px 20px 10px 20px",
          marginY: "10px",
          borderRadius: "20px"
        }}>
          <Typography variant="h6">Query Builder</Typography>
          
          <CustomInput 
              title="$SELECT: "
              value={select}
              setValue={setSelect}
              optional={true}
          ></CustomInput>
          <CustomInput 
              title="$WHERE:"
              value={where}
              setValue={setWhere}
              optional={true}
          ></CustomInput>
          <CustomInput 
              title="$GROUP:"
              value={group}
              setValue={setGroup}
              optional={true}
          ></CustomInput>
           <CustomInput 
              title="$ORDER:"
              value={order}
              setValue={setOrder}
              optional={true}
          ></CustomInput>
          <CustomInput 
              title="$LIMIT:"
              value={limit}
              setValue={setLimit}
              optional={true}
          ></CustomInput>
        </Box>
        
        
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: "10px"
        }}>
          <CustomSelect
            title="ChartType"
            value={chartType}
            handler={handleType}
            options={["line", "bar", "radar", "pie", "doughnut", "polarArea"]}
          ></CustomSelect>
          <CustomSelect
            title="Method"
            value={method}
            handler={handleMethod}
            options={["GET"]}
          ></CustomSelect>
        </Box>
        <Box sx={{
          display: "flex",
          alignItems:"center",
          marginBottom: dateRangeEnabled ? "0px" : "10px"
        }}>
          <InputLabel>Date Range Selector</InputLabel>
          <Checkbox 
            checked={dateRangeEnabled}
            onChange={handleToggleDateRange}
            inputProps={{ 'aria-label': 'controlled' }} 
          />
        </Box>
          {
            dateRangeEnabled && 
              (
                <>
                  <CustomInput 
                    title="Date Column Key:"
                    value={dateColumnKey}
                    setValue={setDateColumnKey}
                  ></CustomInput>
                  
                  <DatePicker fromDate={DateTime.now().minus({ months: 1 }).toMillis()} toDate={DateTime.now().plus({ days: 1 }).toMillis()} setTo={setToDate} setFrom={setFromDate}></DatePicker>
                  
                </>
              )
          }
        </Box>
        
        <Button variant="contained" onClick={onSubmit} sx={{

        }}>Apply</Button>
      </Box>
    </Box>
  );
}

export default React.memo(ChartSettings);
