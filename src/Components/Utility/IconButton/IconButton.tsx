//Deps
import React from "react";

//MUI
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

//Props
interface IIconButtonProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  handler: () => void;
  children?: React.ReactNode;
}

const CustomIconButton: React.FC<IIconButtonProps> = ({
  title,
  loading,
  disabled,
  handler,
  children,
}): JSX.Element => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
      }}
    >
      <Tooltip
        placement="right"
        arrow
        disableHoverListener={disabled}
        title={title}
      >
        <Box
          onClick={disabled ? () => {} : handler}
          sx={[
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              padding: "6px",

              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#302f2f",
              borderRadius: "100%",

              boxShadow: 6,
              backgroundColor: "background.paper",

              cursor: disabled ? "default" : "pointer",
            },
            () => ({
              "&:hover": {
                backgroundColor: disabled
                  ? "background.paper"
                  : "background.default",
              },
            }),
          ]}
        >
          {loading ? <CircularProgress size={20} /> : children}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default React.memo(CustomIconButton);
