//Deps
import React from "react";

//MUI
import {Box} from "@mui/material";

//Components

//Props
interface ITemplateProps {
  children?: React.ReactNode;
}

const Template: React.FC<ITemplateProps> = (props): JSX.Element => {
  return (
    <Box >
      {props?.children}
    </Box>
  );
}

export default React.memo(Template);
