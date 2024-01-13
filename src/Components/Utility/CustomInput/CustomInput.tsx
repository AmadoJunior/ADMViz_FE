//Deps
import React, { ChangeEvent } from "react";

//MUI
import { Box, InputLabel, Input } from "@mui/material";

//Props
interface ICustonInputProps {
  title: string;
  handler?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  children?: React.ReactNode;
}

const CustonInput: React.FC<ICustonInputProps> = ({
  title,
  handler,
  value,
}): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InputLabel htmlFor={`custom-input-${title}`}>{title}</InputLabel>
      <Input
        id={`custom-input-${title}`}
        value={value}
        onChange={handler}
        sx={{
          textAlign: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      />
    </Box>
  );
};

export default React.memo(CustonInput);
