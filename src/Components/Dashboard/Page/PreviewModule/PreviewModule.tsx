//Deps
import React from "react";

//MUI
import { Box, useTheme } from "@mui/material";
import { useDragDropManager } from "react-dnd";

//Components

//Props
interface IPreviewModuleProps {
  children?: React.ReactNode;
  canDrop: boolean;
}

const getStyle = (height: number, width: number): React.CSSProperties => {
  return {
    height: `${height}px`,
    width: `${width}px`,
  };
};

const PreviewModule: React.FC<IPreviewModuleProps> = ({
  canDrop,
}): JSX.Element => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-block",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: "1px",
        borderStyle: "dashed",
        padding: "10px",
        borderColor: canDrop
          ? theme.palette.primary.main
          : theme.palette.error.main,
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "background.default",
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "#302f2f",
          boxShadow: 6,
          opacity: 0.2,
        }}
      ></Box>
    </Box>
  );
};

export default React.memo(PreviewModule);
