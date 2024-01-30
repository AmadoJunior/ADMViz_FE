//Deps
import React from "react";
import { DatePicker as XDatePicker } from '@mui/x-date-pickers/DatePicker';
import {DateTime} from "luxon";

//MUI
import {Box} from "@mui/material";

//Components

//Props
interface IDatePickerProps {
  fromDate: number,
  toDate: number,
  setFrom: (n: number) => void,
  setTo: (n: number) => void,
  children?: React.ReactNode;
}

const DatePicker: React.FC<IDatePickerProps> = ({fromDate, toDate, setFrom, setTo}): JSX.Element => {
  const handleFrom = (dt: DateTime) => {
    setFrom(dt.toMillis());
  }
  const handleTo = (dt: DateTime) => {
    setTo(dt.toMillis());
  }
  
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      marginBottom: "20px",
    }}>
      <XDatePicker label="From" onChange={(newValue) => handleFrom(newValue as DateTime)} defaultValue={DateTime.fromMillis(fromDate)} maxDate={DateTime.fromMillis(toDate)} sx={{
        paddingRight: "20px"
      }}/>
      <XDatePicker label="To" onChange={(newValue) => handleTo(newValue as DateTime)} defaultValue={DateTime.fromMillis(toDate)} minDate={DateTime.fromMillis(fromDate)}/>
    </Box>
  );
}

export default React.memo(DatePicker);
