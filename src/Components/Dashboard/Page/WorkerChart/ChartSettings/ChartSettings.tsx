//Deps
import React, {useContext, useEffect} from "react";
import { ChartType } from "../../../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";

//MUI
import {Box, Button} from "@mui/material";
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
  const [name, setName] = React.useState<string>("");
  const [srcUrl, setSrcUrl] = React.useState<string>("");
  const [dataKey, setDataKey] = React.useState<string>("");
  const [select, setSelect] = React.useState<string | undefined>();
  const [where, setWhere] = React.useState<string | undefined>();
  const [group, setGroup] = React.useState<string | undefined>();
  const [limit, setLimit] = React.useState<string | undefined>();
  const [labelKey, setLabelKey] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("GET");
  const [chartType, setChartType] = React.useState<string>(ChartType.LINE);
  const [fromDate, setFromDate] = React.useState<number>(
    DateTime.now().minus({ months: 1 }).toMillis()
  );
  const [toDate, setToDate] = React.useState<number>(
    DateTime.now().plus({ days: 1 }).toMillis()
  );

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
        setLabelKey(curChart?.details?.labelKey);
        setMethod(curChart?.details?.method);
        setChartType(curChart?.details?.chartType);
        setFromDate(curChart?.details?.fromDate);
        setToDate(curChart?.details?.toDate);
      }
    }
  }, [chartId])

  //Form Handlers
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e?.currentTarget?.value);
  }

  const handleSrcUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSrcUrl(e?.currentTarget?.value);
  }
  
  const handleDataKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDataKey(e?.currentTarget?.value);
  }

  const handleLabelKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLabelKey(e?.currentTarget?.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSelect(e?.currentTarget?.value);
  };
  const handleWhere = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWhere(e?.currentTarget?.value);
  };
  const handleGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setGroup(e?.currentTarget?.value);
  };
  const handleLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLimit(e?.currentTarget?.value);
  };

  const handleMethod = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setMethod(e.target.value);
  };

  const handleType = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setChartType(e.target.value);
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
            handler={handleName}
        ></CustomInput>
        <CustomInput 
            title="Src Url"
            value={srcUrl}
            handler={handleSrcUrl}
        ></CustomInput>
        <CustomInput 
            title="Data Key"
            value={dataKey}
            handler={handleDataKey}
        ></CustomInput>
        <CustomInput 
            title="Select"
            value={select}
            handler={handleSelect}
        ></CustomInput>
        <CustomInput 
            title="Where"
            value={where}
            handler={handleWhere}
        ></CustomInput>
        <CustomInput 
            title="Group"
            value={group}
            handler={handleGroup}
        ></CustomInput>
        <CustomInput 
            title="Limit"
            value={limit}
            handler={handleLimit}
        ></CustomInput>
        <CustomInput 
            title="Label Key"
            value={labelKey}
            handler={handleLabelKey}
        ></CustomInput>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: "20px"
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
        
        <DatePicker fromDate={fromDate} toDate={toDate} setTo={setToDate} setFrom={setFromDate}></DatePicker>
        </Box>
        
        <Button variant="contained" onClick={onSubmit} sx={{

        }}>Apply</Button>
      </Box>
    </Box>
  );
}

export default React.memo(ChartSettings);
