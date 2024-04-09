//Deps
import React from "react";
import { Box } from "@mui/material";
import type { XYCoord } from "react-dnd";
import { useDragLayer, useDragDropManager } from "react-dnd";

//Helpers
import { snapToGrid, getCollidingModule } from "./../Module/CollisionHelpers";

//Context
import { DashboardContext } from "../../../../Context/DashboardContext/useDashboardContext";

//Components
import PreviewModule from "../PreviewModule/PreviewModule";

//Const
import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  MIN_HEIGHT,
  MIN_WIDTH,
} from "../../../../constants";
import { useRafLoop } from "react-use";

function getDragStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  parentEl: React.MutableRefObject<HTMLInputElement>
): React.CSSProperties {
  if (!initialOffset || !currentOffset || !parentEl?.current) {
    return {
      display: "none",
    };
  }

  const parentOrigin = {
    x: parentEl.current?.offsetLeft - parentEl.current?.scrollLeft,
    y: parentEl.current?.offsetTop - parentEl.current?.scrollTop,
  };
  const { x, y } = currentOffset;

  const xDifference = x - initialOffset.x;
  const yDifference = y - initialOffset.y;
  const [xStep, yStep] = snapToGrid(xDifference, yDifference, COLUMN_WIDTH);
  const targetX = initialOffset.x + xStep;
  const targetY = initialOffset.y + yStep;

  const transform = `translate(${targetX - (GUTTER_SIZE + parentOrigin.x)}px, ${
    targetY - (GUTTER_SIZE + parentOrigin.y)
  }px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

function getResizeStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  parentEl: React.MutableRefObject<HTMLInputElement>,
  initialSize: React.MutableRefObject<
    { height: number; width: number } | undefined
  >
): React.CSSProperties {
  if (
    !initialOffset ||
    !currentOffset ||
    !parentEl?.current ||
    !initialSize?.current
  ) {
    return {
      display: "none",
    };
  }
  const parentOrigin = {
    x: parentEl.current?.offsetLeft - parentEl.current?.scrollLeft,
    y: parentEl.current?.offsetTop - parentEl.current?.scrollTop,
  };
  const { x, y } = currentOffset;

  const xDifference = x - initialOffset.x;
  const yDifference = y - initialOffset.y;
  const [xStep, yStep] = snapToGrid(xDifference, yDifference, COLUMN_WIDTH);
  const targetW = initialSize.current.width + xStep;
  const targetH = initialSize.current.height + yStep;
  const targetX = initialOffset.x - (initialSize.current?.width - GUTTER_SIZE);
  const targetY = initialOffset.y - (initialSize.current?.height - GUTTER_SIZE);

  const transform = `translate(${targetX - parentOrigin.x}px, ${
    targetY - parentOrigin.y
  }px) scale(${targetW / initialSize.current.width}, ${
    targetH / initialSize.current.height
  })`;
  return {
    transform,
    transformOrigin: "top left",
    WebkitTransform: transform,
  };
}

//Props
interface CustomDragLayerProps {
  parentEl: React.MutableRefObject<HTMLInputElement>;
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ parentEl }) => {
  //Dash Context
  const { charts } = React.useContext(DashboardContext);

  //DnD Manager
  const dndManager = useDragDropManager();
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  //Initial Pos/Size
  const initialPosition = React.useRef<{ top: number; left: number }>();
  const initialSize = React.useRef<{ height: number; width: number }>();

  //State
  const [canDrop, setCanDrop] = React.useState(true);
  const [positionStyle, setPositionStyle] = React.useState({});

  //Raf Loop Handler
  const handleStyles = React.useCallback(() => {
    if (itemType === "resize") {
      setPositionStyle(
        getResizeStyles(initialOffset, currentOffset, parentEl, initialSize)
      );
    } else {
      setPositionStyle(getDragStyles(initialOffset, currentOffset, parentEl));
    }

    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !initialSize.current || !movement) {
      return;
    }

    let left;
    let top;
    let width;
    let height;

    if (itemType === "resize") {
      left = initialPosition.current.left;
      top = initialPosition.current.top;
      width = Math.round(initialSize.current.width + movement.x);
      height = Math.round(initialSize.current.height + movement.y);
    } else {
      left = Math.round(initialPosition.current.left + movement.x);
      top = Math.round(initialPosition.current.top + movement.y);
      width = initialSize.current.width;
      height = initialSize.current.height;
    }

    const [newLeft, newTop] = snapToGrid(left, top, COLUMN_WIDTH);
    const [newWidth, newHeight] = snapToGrid(width, height, COLUMN_WIDTH);

    const collidingChart = getCollidingModule(
      charts,
      item.position.id,
      newWidth,
      newHeight,
      newLeft,
      newTop
    );

    if (
      !collidingChart &&
      newWidth >= MIN_WIDTH &&
      newHeight >= MIN_HEIGHT &&
      newLeft >= 10 &&
      newTop >= 10
    ) {
      setCanDrop(true);
    } else {
      setCanDrop(false);
    }
  }, [initialOffset, currentOffset, parentEl, charts, setPositionStyle]);

  const [stop, start] = useRafLoop(handleStyles, true);

  React.useEffect(() => {
    if (isDragging) {
      start();
    } else {
      stop();
    }
  }, [isDragging]);

  React.useEffect(() => {
    if (item) {
      console.log(item?.position);
      initialPosition.current = {
        top: item.position?.y,
        left: item.position?.x,
      };
      initialSize.current = {
        height: item.position?.h,
        width: item.position?.w,
      };
      console.log(initialPosition, initialSize);
    }
  }, [charts, item]);

  //Render
  if (!isDragging) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        pointerEvents: "none",
        zIndex: 100,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        position="absolute"
        sx={{
          ...positionStyle,
          height: item?.position?.h,
          width: item?.position?.w,
        }}
      >
        <PreviewModule canDrop={canDrop} />
      </Box>
    </Box>
  );
};

export default CustomDragLayer;
