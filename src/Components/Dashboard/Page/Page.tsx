//Deps
import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useDraggable } from "react-use-draggable-scroll";

//Components
import Module from "./Module/Module";
import WorkerChart from "./WorkerChart/WorkerChart";
import CustomDragLayer from "./CustomDragLayer/CustomDragLayer";

//Constants
import { COLUMN_WIDTH, GUTTER_SIZE, NAV_HEIGHT } from "../../../constants";

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";
import { IChart, IChartPosition } from "../../../Context/DashboardContext/interfaces";

//Helpers
import { getCollidingModule, snapToGrid } from "./Module/CollisionHelpers";

//Props
interface IPageProps {
  disabled?: boolean;
}

const Page: React.FC<IPageProps> = ({disabled}) => {
  //Theme
  const theme = useTheme();

  //State
  const {charts} = useContext(DashboardContext);
  const [height, setHeight] = React.useState(0);

  // Wire the Module to DnD Drag System
  const [, drop] = useDrop(() => ({
    accept: ["module", "resize"],
    collect(monitor) {
      return {
        canDrop: !!monitor.canDrop(),
      }
    }
  }), []);

  //Ref
  const containerRef = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLInputElement>;

  //Setup Drop Container
  drop(containerRef);

  //Setup Draggable Scroll
  const { events } = useDraggable(containerRef, {
    activeMouseButton: "Right"
  });

  //Calc Height
  const containerHeight = React.useMemo(() => {
    return (
      (height - NAV_HEIGHT) +
      GUTTER_SIZE * 2
    );
  }, [charts, height]);
  
  //Effects
  React.useEffect(() => {
    const handleResize = () => {
      setHeight(document.documentElement.clientHeight);
    };

    // Init
    handleResize();

    // Event Listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Render
  return (
    <Box
      {...events}
      ref={containerRef}
      
      sx={{
        position: "relative",

        backgroundColor: "background.default",

        height: `${containerHeight}px`,
        width:"100%",

        overflow: "scroll",
        cursor: "grab",

        backgroundImage: `linear-gradient(${theme.palette.background.paper} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.background.paper} 1px, transparent 1px)`,
        backgroundSize: `${COLUMN_WIDTH}px ${COLUMN_WIDTH}px`,
        backgroundAttachment: "local",
      }}

      onContextMenu={(e)=> e.preventDefault()}
    >
      <CustomDragLayer parentEl={containerRef}/>
      {charts?.length ? charts?.map((chart) => (
        <Module disabled={disabled} key={`Module${chart?.chartId}`} chartId={chart?.chartId} position={chart?.position} parentEl={containerRef}>
          <WorkerChart disabled={disabled} chartId={chart?.chartId} chartDetails={chart?.details} name={chart?.details?.name}></WorkerChart> 
        </Module>
      )) : null}
    </Box>
  );
};

export default React.memo(Page);
