//Deps
import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";

//MUI
import { Box } from "@mui/material";

//Components
import CollapseForm from "../../Utility/CollapseForm/CollapseForm";
import IconButton from "../../Utility/IconButton/IconButton";

//Constants
import { MIN_HEIGHT, MIN_WIDTH, GUTTER_SIZE } from "../../../constants";
import { DefaultChartDetails } from "./DefaultChartDetails";

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";

//Icons
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

//Helpers
import { findFreeSpace } from "../Page/Module/CollisionHelpers";

//Props
type ContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};
interface IChartFactoryProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

const ChartFactory: React.FC<IChartFactoryProps> = ({
  disabled,
}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);
  const { isAuthenticated } = useOutletContext<ContextType>();

  //State
  const [inputTitle, setInputTitle] = useState<string>("");

  //Form Handler
  const handleNew = () => {
    const positionObj = {
      id: 0,
      x: 10,
      y: 10,
      w: MIN_WIDTH,
      h: MIN_HEIGHT,
    };

    const chartPositions = dashboardContext?.charts?.map(
      (chart) => chart?.position
    );

    const { updatedTop, updatedLeft } = findFreeSpace(
      chartPositions,
      positionObj,
      document.body.clientWidth
    );
    console.log(updatedLeft, updatedTop);
    return dashboardContext
      .insertChart(DefaultChartDetails(inputTitle), {
        x: Math.max(updatedLeft, GUTTER_SIZE),
        y: Math.max(updatedTop, GUTTER_SIZE),
        w: positionObj.w,
        h: positionObj.h,
      })
      .finally(() => {
        setTimeout(() => {
          window.scrollTo({
            top: updatedTop,
            behavior: "smooth",
          });
        }, 200);
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CollapseForm
        formName="Create Chart"
        disabled={dashboardContext.isLocked || disabled}
        inputState={{
          value: inputTitle,
          setValue: setInputTitle,
        }}
        submitHandler={handleNew}
      />
      <IconButton
        title={"Lock"}
        aria-label="lock"
        disabled={!isAuthenticated || disabled}
        handler={dashboardContext.toggleLocked}
      >
        {dashboardContext?.isLocked ? (
          <LockIcon
            sx={{
              color: !isAuthenticated || disabled ? "#302f2f" : "white",
            }}
          />
        ) : (
          <LockOpenIcon />
        )}
      </IconButton>
    </Box>
  );
};

export default React.memo(ChartFactory);
