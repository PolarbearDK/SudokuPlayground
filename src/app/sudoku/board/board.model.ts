export interface BoardCell {
  invalid?: boolean;
  locked?: boolean;
  possibleValues?: number[];
  determinedValue?: number;
  value?: number;
}

export interface BoardDimensions {
  boxWidth: number;
  boxHeight: number;
  boxesX: number;
  boxesY: number;
}

export function getBoardSize(dimensions: BoardDimensions) {
  return {
    width: dimensions.boxWidth * dimensions.boxesX,
    height: dimensions.boxHeight * dimensions.boxesY,
  };
}

export function getSetSize(dimensions: BoardDimensions) {
  return dimensions.boxWidth * dimensions.boxHeight;
}
