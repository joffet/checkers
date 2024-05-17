export const initCheckersArray: SquareInputs[] = [
  { x: 2, y: 1, content: "red" },
  { x: 4, y: 1, content: "red" },
  { x: 6, y: 1, content: "red" },
  { x: 8, y: 1, content: "red" },
  { x: 1, y: 2, content: "red" },
  { x: 3, y: 2, content: "red" },
  { x: 5, y: 2, content: "red" },
  { x: 7, y: 2, content: "red" },
  { x: 2, y: 3, content: "red" },
  { x: 4, y: 3, content: "red" },
  { x: 6, y: 3, content: "red" },
  { x: 8, y: 3, content: "red" },
  { x: 1, y: 6, content: "black" },
  { x: 3, y: 6, content: "black" },
  { x: 5, y: 6, content: "black" },
  { x: 7, y: 6, content: "black" },
  { x: 2, y: 7, content: "black" },
  { x: 4, y: 7, content: "black" },
  { x: 6, y: 7, content: "black" },
  { x: 8, y: 7, content: "black" },
  { x: 1, y: 8, content: "black" },
  { x: 3, y: 8, content: "black" },
  { x: 5, y: 8, content: "black" },
  { x: 7, y: 8, content: "black" },
];

export const initDragValues = {
  top: 0,
  left: 0,
  width: 0,
  hoverX: 0,
  hoverY: 0,
};

export const moveDifferentials = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

export const jumpDifferentials = [
  { x: -2, y: -2 },
  { x: 2, y: -2 },
  { x: -2, y: 2 },
  { x: 2, y: 2 },
];

export type SquareInputs = {
  x: number;
  y: number;
  isKing?: boolean;
  index?: number;
  content?: SquareContent;
};

export type SquareInputsArray = [] | SquareInputs[];

export type SquareContent = "red" | "black" | "eligibleDestination" | undefined;

export type SetHoverCoordinates = SquareInputs | undefined;

export type DragValues = {
  top: number;
  left: number;
  width: number;
  hoverX: number;
  hoverY: number;
};

export type PotentialDestinations = {
  [key: string]: SquareInputsArray;
};
