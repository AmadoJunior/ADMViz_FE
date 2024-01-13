//Deps
import React from 'react';
import { Box } from '@mui/material';
import type { XYCoord } from 'react-dnd';
import { useDragLayer, useDragDropManager } from 'react-dnd';

//Helpers
import { snapToGrid, getCollidingModule } from './../Module/CollisionHelpers';

//Context
import { DashboardContext } from '../../../../Context/DashboardContext/useDashboardContext';

//Components
import PreviewModule from '../PreviewModule/PreviewModule';

//Const
import { COLUMN_WIDTH, GUTTER_SIZE } from '../../../../constants';
import { useRafLoop } from 'react-use';

function getPositionStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  parentEl: React.MutableRefObject<HTMLInputElement>,
): React.CSSProperties {
  if (!initialOffset || !currentOffset || !parentEl?.current) {
    return {
      display: 'none',
    }
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
  
  const transform = `translate(${targetX - (GUTTER_SIZE + parentOrigin.x)}px, ${targetY - (GUTTER_SIZE + parentOrigin.y)}px)`;
  return {
    transform,
    WebkitTransform: transform,
  }
}

//Props
interface CustomDragLayerProps {
  parentEl: React.MutableRefObject<HTMLInputElement>;
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({parentEl}) => {
  //Dash Context
  const {charts} = React.useContext(DashboardContext);

  //Initial Pos/Size
  const initialPosition = React.useRef<{ top: number; left: number }>();
  
  //DnD Manager
  const dndManager = useDragDropManager();
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  //State
  const [canDrop, setCanDrop] = React.useState(true);
  const [positionStyle, setPositionStyle] = React.useState(getPositionStyles(initialOffset, currentOffset, parentEl));

  //Raf Loop Handler
  const handleStyles = React.useCallback(() => {
    console.log("Raf Running")
    setPositionStyle(getPositionStyles(initialOffset, currentOffset, parentEl));
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
    const currentChart = dndManager.getMonitor().getItem();

    if (!initialPosition.current || !movement) {
      return;
    }
  
    let left = Math.round(initialPosition.current.left + movement.x);
    let top = Math.round(initialPosition.current.top + movement.y);

    const [newLeft, newTop] = snapToGrid(left, top, COLUMN_WIDTH);
  
    const collidingChart = getCollidingModule(charts, currentChart, newLeft, newTop);
    if (!collidingChart) {
      console.log("candrop")
      setCanDrop(true);
    } else {
      console.log("cannotdrop")
      setCanDrop(false);
    }
  }, [initialOffset, currentOffset, parentEl, charts, setPositionStyle]);

  const [stop, start] = useRafLoop(handleStyles, true);

  React.useEffect(() => {
    if(isDragging){
      start();
    } else {
      stop();
    }
  }, [isDragging])

  //Initial State
  React.useEffect(() => {
    if(item?.position) {
      initialPosition.current = {
        top: item.position?.y,
        left: item.position?.x,
      };
    }
  }, [item]);

  //Render
  if(!isDragging){
    return null;
  }

  return (
    <Box sx={{
      position: 'relative',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }}>
      <Box position="absolute" sx={{
        ...positionStyle,
        
      }}>
        <PreviewModule height={item?.position?.h} width={item?.position?.w} canDrop={canDrop}/>
      </Box>
    </Box>
  )
}

export default React.memo(CustomDragLayer);