import { SquareInputsArray } from "./Types";

const squareIsOccupied = (
  x: number,
  y: number,
  checkersArray: SquareInputsArray
) => {
  if (x < 1 || x > 8 || y < 1 || y > 8) return undefined;
  const occupier = checkersArray.find((e) => e.x === x && e.y === y);
  return !!occupier;
};

const getColorOfOccupierOrUndefined = (
  x: number,
  y: number,
  redCheckersArray: SquareInputsArray,
  blackCheckersArray: SquareInputsArray
) => {
  if (squareIsOccupied(x, y, redCheckersArray)) return "red";
  if (squareIsOccupied(x, y, blackCheckersArray)) return "black";
};

const coordsForValidMove = ({
  targetX,
  targetY,
  jumpX,
  jumpY,
  redCheckersArray,
  blackCheckersArray,
  color,
}: {
  targetX: number;
  targetY: number;
  jumpX: number;
  jumpY: number;
  redCheckersArray: SquareInputsArray;
  blackCheckersArray: SquareInputsArray;
  color: "red" | "black";
}) => {
  const occupantColor = getColorOfOccupierOrUndefined(
    targetX,
    targetY,
    redCheckersArray,
    blackCheckersArray
  );
  if (!occupantColor) {
    // empty square
    return { x: targetX, y: targetY };
  } else if (
    occupantColor !== color &&
    !getColorOfOccupierOrUndefined(
      jumpX,
      jumpY,
      redCheckersArray,
      blackCheckersArray
    )
  ) {
    // eligible jump
    return { x: jumpX, y: jumpY };
  }
};

export const getEligibleMovesArray = ({
  x,
  y,
  color,
  redCheckersArray,
  blackCheckersArray,
  isKing,
}: {
  x: number;
  y: number;
  redCheckersArray: SquareInputsArray;
  blackCheckersArray: SquareInputsArray;
  color: "red" | "black";
  isKing?: boolean;
}) => {
  let array = [];
  const canMoveUp = color !== "red" || isKing;
  const canMoveDown = color === "red" || isKing;

  if (canMoveUp) {
    const topLeftOption = coordsForValidMove({
      targetX: x - 1,
      targetY: y - 1,
      jumpX: x - 2,
      jumpY: y - 2,
      redCheckersArray,
      blackCheckersArray,
      color,
    });
    if (topLeftOption) array.push(topLeftOption);
    const topRightOption = coordsForValidMove({
      targetX: x + 1,
      targetY: y - 1,
      jumpX: x + 2,
      jumpY: y - 2,
      redCheckersArray,
      blackCheckersArray,
      color,
    });
    if (topRightOption) array.push(topRightOption);
  }
  if (canMoveDown) {
    const bottomLeftOption = coordsForValidMove({
      targetX: x - 1,
      targetY: y + 1,
      jumpX: x - 2,
      jumpY: y + 2,
      redCheckersArray,
      blackCheckersArray,
      color,
    });
    if (bottomLeftOption) array.push(bottomLeftOption);
    const bottomRightOption = coordsForValidMove({
      targetX: x + 1,
      targetY: y + 1,
      jumpX: x + 2,
      jumpY: y + 2,
      redCheckersArray,
      blackCheckersArray,
      color,
    });
    if (bottomRightOption) array.push(bottomRightOption);
  }
  return array;
};
