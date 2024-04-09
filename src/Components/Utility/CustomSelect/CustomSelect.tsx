//Deps
import React from "react";

//MUI
import {
  Box,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

//Props
interface ICustomSelectProps {
  title: string;
  handler: (e: SelectChangeEvent<string>) => void;
  value: string;
  children?: React.ReactNode;
  options: string[];
}

const CustomSelect: React.FC<ICustomSelectProps> = ({
  title,
  handler,
  value,
  options,
}): JSX.Element => {
  return (
    <Box
      sx={{
        position: "relative",
        flexDirection: "column",
        display: "flex",
        paddingRight: "20px",
      }}
    >
      <InputLabel
        id="selectFilter"
        sx={{
          display: "flex",
          backgroundColor: "background.paper",
          paddingRight: "5px",
          zIndex: "1 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              backgroundColor: "background.paper",
              zIndex: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
      </InputLabel>
      <Select
        labelId={`select${title}`}
        value={value}
        label={title}
        onChange={handler}
      >
        {options?.map((item, index) => {
          return (
            <MenuItem key={index} value={item}>
              {item.toUpperCase()}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default React.memo(CustomSelect);
