import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  MIN_HEIGHT,
  MIN_WIDTH,
} from "../../../../constants";
import { IChartPosition, IChart } from "../../../../Context/DashboardContext/interfaces";

export const getCollidingModule = (
  charts: IChart[],
  moduleId: number,
  newWidth: number,
  newHeight: number,
  newLeft: number,
  newTop: number
): IChart | undefined => {
  return charts?.find((chart) => {
    const module = chart.position;
    if (module.id === moduleId) return false;

    const verticalOverlap =
      newTop + newHeight + GUTTER_SIZE > module.y &&
      newTop < module.y + module.h + GUTTER_SIZE;

    const currentModuleRightEdge = newLeft + newWidth + GUTTER_SIZE;
    const moduleRightEdge = module.x + module.w + GUTTER_SIZE;
    
    const horizontalOverlap =
      currentModuleRightEdge > module.x &&
      (newLeft) < moduleRightEdge;
    return verticalOverlap && horizontalOverlap;
  });
};

export const isColliding = (
  charts: IChart[],
  moduleId: number,
  newWidth: number,
  newHeight: number,
  newLeft: number,
  newTop: number
): boolean => {
  return charts?.find((chart) => {
    const module = chart.position;

    if (module.id === moduleId) return false;
    
    const verticalOverlap =
      newTop + newHeight + GUTTER_SIZE > module.y &&
      newTop < module.y + module.h + GUTTER_SIZE;

    const currentModuleRightEdge = newLeft + newWidth + GUTTER_SIZE;
    const moduleRightEdge = module.x + module.w + GUTTER_SIZE;
    
    const horizontalOverlap =
      currentModuleRightEdge > module.x &&
      (newLeft) < moduleRightEdge;
    return verticalOverlap && horizontalOverlap;
  }) ? true : false;
};

export const findNearestFreePosition = (
  currentChart: IChart,
  collidingChart: IChart,
  newLeft: number,
  newTop: number
) => {
  const currentModule = currentChart.position;
  const collidingModule = collidingChart.position;

  const upCorrection =
    newTop + currentModule.h - collidingModule.y + GUTTER_SIZE;
  const downCorrection =
    collidingModule.y + collidingModule.h - newTop + GUTTER_SIZE;
  const leftCorrection =
    newLeft +
    currentModule.w -
    collidingModule.x - GUTTER_SIZE;
  const rightCorrection =
    collidingModule.x +
    collidingModule.w + GUTTER_SIZE -
    newLeft;
  const isUpOrDown =
    Math.min(upCorrection, downCorrection) <
    Math.min(leftCorrection, rightCorrection);

  const updatedTop =
    newTop +
    (isUpOrDown
      ? upCorrection < downCorrection
        ? -upCorrection
        : downCorrection
      : 0);
  const updatedLeft =
    newLeft +
    (!isUpOrDown
      ? leftCorrection < rightCorrection
        ? -(leftCorrection + COLUMN_WIDTH * 2)
        : rightCorrection
      : 0);

  return {
    updatedLeft,
    updatedTop,
  };
};

export const findNearestFreeSize = (
  currentChart: IChart,
  collidingChart: IChart,
  newWidth: number,
  newHeight: number
) => {
  const currentModule = currentChart.position;
  const collidingModule = collidingChart.position;

  const upCorrection =
    currentModule.y + newHeight - collidingModule.y + GUTTER_SIZE;
  const downCorrection =
    collidingModule.y + collidingModule.h - currentModule.y + GUTTER_SIZE;
  const leftCorrection =
    currentModule.x +
    newWidth -
    collidingModule.x + GUTTER_SIZE;
  const rightCorrection =
    collidingModule.x +
    collidingModule.w + GUTTER_SIZE -
    currentModule.x;
  const isUpOrDown =
    Math.min(upCorrection, downCorrection) <
    Math.min(leftCorrection, rightCorrection);

  const updatedHeight =
  newHeight +
    (isUpOrDown
      ? upCorrection < downCorrection
        ? -(upCorrection)
        : downCorrection
      : 0);
  const updatedWidth =
    newWidth +
    (!isUpOrDown
      ? leftCorrection < rightCorrection
        ? -(leftCorrection)
        : rightCorrection
      : 0);

  return {
    updatedWidth: Math.max(updatedWidth, MIN_WIDTH),
    updatedHeight: Math.max(updatedHeight, MIN_HEIGHT),
  };
};

export const snapToGrid = (x: number, y: number, stepSize: number): [number, number] => {
  const snappedX = Math.round(x / stepSize) * stepSize
  const snappedY = Math.round(y / stepSize) * stepSize
  return [snappedX, snappedY]
}


export const findFreeSpace = (
  chartPositions: IChartPosition[],
  currentModule: IChartPosition,
  clientWidth: number,
) => {
  console.log(chartPositions, currentModule, clientWidth)
  let availableSpaces = chartPositions
    .map(pos => ({
      x: pos.x + pos.w,
      y: pos.y
    }))
    .filter(space => space.x + currentModule.w <= clientWidth);

  // Add initial position
  availableSpaces.push({ x: 0, y: 0 });

  // Sort by y, then by x
  availableSpaces.sort((a, b) => a.y - b.y || a.x - b.x);

  for (const space of availableSpaces) {
    let isSpaceFree = true;

    for (const pos of chartPositions) {
      if (space.x < pos.x + pos.w && 
          space.x + currentModule.w > pos.x &&
          space.y < pos.y + pos.h && 
          space.y + currentModule.h > pos.y) {
        isSpaceFree = false;
        break;
      }
    }

    //Free Space Found
    if (isSpaceFree) {
      return { updatedLeft: space.x + GUTTER_SIZE, updatedTop: space.y };
    }
  }

  //Return Lowest Pos
  let lowestPosition = chartPositions.reduce((max, pos) => Math.max(max, pos.y + pos.h), 0);
  return { updatedLeft: currentModule.x, updatedTop: lowestPosition + GUTTER_SIZE };
};