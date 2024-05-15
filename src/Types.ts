export const initRedCheckersArray = [
  { x: 2, y: 1 },
  { x: 4, y: 1 },
  { x: 6, y: 1 },
  { x: 8, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 2 },
  { x: 5, y: 2 },
  { x: 7, y: 2 },
  { x: 2, y: 3 },
  { x: 4, y: 3 },
  { x: 6, y: 3 },
  { x: 8, y: 3 },
];

export const initBlackCheckersArray: SquareInputsArray = [
  { x: 1, y: 6 },
  { x: 3, y: 6 },
  { x: 5, y: 6 },
  { x: 7, y: 6 },
  { x: 2, y: 7 },
  { x: 4, y: 7 },
  { x: 6, y: 7 },
  { x: 8, y: 7 },
  { x: 1, y: 8 },
  { x: 3, y: 8 },
  { x: 5, y: 8 },
  { x: 7, y: 8 },
];

export type SquareInputs = {
  x: number;
  y: number;
  isKing?: boolean;
  index?: number;
  content?: SquareContent;
};

export type SquareInputsArray = [] | SquareInputs[];

export type CheckerColor = "red" | "black";

export type SquareContent = "red" | "black" | "destination" | undefined;

export type SetHoverCoordinates =
  | { x: number; y: number; color: CheckerColor; isKing: boolean }
  | undefined;
