//Deps
import React from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box, useTheme } from "@mui/material";
import { useDrag, useDragDropManager } from "react-dnd";
import { useRafLoop } from "react-use";
import DeleteIcon from "@mui/icons-material/Delete";

//MUI LAB
import { LoadingButton } from "@mui/lab";

//Context
import { DashboardContext } from "../../../../Context/DashboardContext/useDashboardContext";

//Interfaces && Types
import { IChartPosition } from "../../../../Context/DashboardContext/interfaces";

//Constants && Helpers
import {
  snapToGrid,
  getCollidingModule,
  findNearestFreePosition,
  findNearestFreeSize,
} from "./CollisionHelpers";
import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  MIN_HEIGHT,
  MIN_WIDTH,
} from "../../../../constants";

//Props
type ModuleProps = {
  chartId: number;
  position: IChartPosition;
  children?: React.ReactNode;
  parentEl: React.MutableRefObject<HTMLInputElement>;
  disabled?: boolean;
};

function getPositionStyles(
  left: number,
  top: number,
  isDragging: boolean
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    WebkitTransform: transform,
  };
}

const Module: React.FC<ModuleProps> = ({
  chartId,
  position,
  children,
  parentEl,
  disabled,
}) => {
  //Dash Context
  const {
    charts,
    updateChartPosition,
    removeChart,
    isLocked,
  } = React.useContext(DashboardContext);

  //Ref
  const moduleRef = React.useRef<HTMLDivElement>(null);

  //Props Destruct
  const { id } = position;

  //Local Vars
  const initialPosition = React.useRef<{ top: number; left: number }>();
  const [x, setX] = React.useState(position.x);
  const [y, setY] = React.useState(position.y);
  const [h, setH] = React.useState(position.h);
  const [w, setW] = React.useState(position.w);

  //State
  const [removalLoading, setRemovalLoading] = React.useState(false);

  //DnD Manager
  const dndManager = useDragDropManager();

  //Local State
  const moveChart = (newLeft: number, newTop: number) => {
    setY(Math.max(newTop, GUTTER_SIZE));
    setX(Math.max(newLeft, GUTTER_SIZE));
  };

  const resizeChart = (newHeight: number, newWidth: number) => {
    setH(newHeight);
    setW(newWidth);
  };

  //Drag Handlers
  const handleDrag = React.useCallback(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
    const currentChart = dndManager.getMonitor().getItem();

    if (!initialPosition.current || !movement) {
      return;
    }

    let left = Math.round(initialPosition.current.left + movement.x);
    let top = Math.round(initialPosition.current.top + movement.y);

    const [newLeft, newTop] = snapToGrid(left, top, COLUMN_WIDTH);
    const collidingChart = getCollidingModule(
      charts,
      id,
      w,
      h,
      newLeft,
      newTop
    );
    if (!collidingChart) {
      moveChart(newLeft, newTop);
    } else {
      const { updatedLeft, updatedTop } = findNearestFreePosition(
        currentChart,
        collidingChart,
        newLeft,
        newTop
      );

      const updatedCollidingChart = getCollidingModule(
        charts,
        id,
        w,
        h,
        updatedLeft,
        updatedTop
      );

      if (!updatedCollidingChart && updatedLeft >= 0 && updatedTop >= 0) {
        moveChart(updatedLeft, updatedTop);
      }
    }
  }, [dndManager, w, h, x, y]);

  //Drag Raf
  const [stopDrag, startDrag] = useRafLoop(handleDrag, false);

  const onDragStart = React.useCallback(() => {
    // Track the Initial Position
    initialPosition.current = { top: y, left: x };

    // Start RAF
    startDrag();

    return {
      chartId,
      position: { id, w, h, x, y },
    };
  }, [chartId, id, w, h, x, y]);

  const onDragStop = React.useCallback(() => {
    // Stop RAF
    stopDrag();

    updateChartPosition(chartId, {
      id,
      x,
      y,
      h,
      w,
    });
  }, [updateChartPosition, chartId, id, x, y, h, w]);

  const handleLocked = React.useCallback(() => {
    return !isLocked;
  }, [isLocked]);

  // Wire the Module to DnD Drag System
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "module",
      item: onDragStart,
      end: onDragStop,
      canDrag: handleLocked,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, y, x, h, w, isLocked]
  );

  // Custom Resize State
  const handleResize = React.useCallback(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
    const currentChart = dndManager.getMonitor().getItem();

    if (!initialSize.current || !movement) {
      return;
    }

    let width = Math.max(
      Math.round(initialSize.current.width + movement.x),
      MIN_WIDTH
    );
    let height = Math.max(
      Math.round(initialSize.current.height + movement.y),
      MIN_HEIGHT
    );

    const [newWidth, newHeight] = snapToGrid(width, height, COLUMN_WIDTH);
    const collidingChart = getCollidingModule(
      charts,
      id,
      newWidth,
      newHeight,
      x,
      y
    );
    if (!collidingChart) {
      resizeChart(newHeight, newWidth);
    } else {
      const { updatedWidth, updatedHeight } = findNearestFreeSize(
        currentChart,
        collidingChart,
        newWidth,
        newHeight
      );
      const updatedCollidingChart = getCollidingModule(
        charts,
        id,
        updatedWidth,
        updatedHeight,
        x,
        y
      );

      if (!updatedCollidingChart) {
        resizeChart(updatedHeight, updatedWidth);
      }
    }
  }, [dndManager, w, h, x, y]);

  //Drag Raf
  const [stopResize, startResize] = useRafLoop(handleResize, false);

  const initialSize = React.useRef<{ width: number; height: number }>();

  const onResizeStart = React.useCallback(() => {
    console.log("resize start");
    // Track the Initial Position
    initialSize.current = { height: h, width: w };

    // Start RAF
    startResize();

    return {
      chartId,
      position: { id, w, h, x, y },
    };
  }, [chartId, id, w, h, x, y]);

  const onResizeStop = React.useCallback(() => {
    console.log("resize stop");

    //Stop RAF
    stopResize();

    updateChartPosition(chartId, {
      id,
      x,
      y,
      h,
      w,
    });
  }, [updateChartPosition, chartId, id, x, y, h, w]);

  const [{ isResizing }, resize, resizePreview] = useDrag(
    () => ({
      type: "resize",
      item: onResizeStart,
      end: onResizeStop,
      canDrag: handleLocked,
      collect: (monitor) => ({
        isResizing: !!monitor.isDragging(),
      }),
    }),
    [id, y, x, h, w, isLocked]
  );

  //Disable Preview
  React.useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
    resizePreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  //Delete
  const handleChartRemoval = React.useCallback(
    (chartId: number) => {
      setRemovalLoading(true);
      removeChart(chartId).finally(() => {
        setRemovalLoading(false);
      });
    },
    [removeChart, setRemovalLoading, chartId]
  );

  //Render
  return (
    <Box
      ref={moduleRef}
      display="flex"
      position="absolute"
      top="0px"
      left="0px"
      sx={{
        ...getPositionStyles(x, y, isDragging),
      }}
    >
      <Box
        sx={{
          padding: `${GUTTER_SIZE}px`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderStyle: "dashed",
          borderColor: "#302f2f",
          borderWidth: "1px",

          minWidth: MIN_WIDTH,
          minHeight: MIN_HEIGHT,
        }}
      >
        <Box
          ref={drag}
          height="100%"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          sx={{
            position: "relative",
            cursor: "move",
            width: w - GUTTER_SIZE * 2,
            height: h - GUTTER_SIZE * 2,
          }}
          draggable
        >
          <LoadingButton
            disabled={disabled}
            variant="contained"
            color="error"
            loading={removalLoading}
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 5,
            }}
            onClick={() => handleChartRemoval(chartId)}
          >
            <DeleteIcon />
          </LoadingButton>
          {children}
        </Box>
        <Box
          ref={resize}
          draggable
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "10px",
            height: "10px",
            borderRight: "2px solid",
            borderBottom: "2px solid",
            borderColor: "white",
            cursor: "nwse-resize",
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(Module);
