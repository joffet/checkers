import { SquareContent, SquareInputs, SquareInputsArray } from "./Types";

const getColorOfOccupierOrUndefined = (
  x: number,
  y: number,
  checkersArray: SquareInputsArray
) => {
  const checker = checkersArray.find((e) => e.x === x && e.y === y);
  return checker?.content;
};

const coordsForValidMove = ({
  targetX,
  targetY,
  jumpX,
  jumpY,
  checkersArray,
  content,
}: {
  targetX: number;
  targetY: number;
  jumpX: number;
  jumpY: number;
  checkersArray: SquareInputsArray;
  content: SquareContent;
}): SquareInputs | undefined => {
  if (targetX < 1 || targetY > 8) return;
  const targetOccupantColor = getColorOfOccupierOrUndefined(
    targetX,
    targetY,
    checkersArray
  );
  if (!targetOccupantColor) {
    // empty square
    return { x: targetX, y: targetY };
  } else if (
    jumpX > 0 &&
    jumpY < 9 &&
    targetOccupantColor !== content &&
    !getColorOfOccupierOrUndefined(jumpX, jumpY, checkersArray)
  ) {
    // eligible jump
    return { x: jumpX, y: jumpY };
  }
};

export const getEligibleMovesArray = ({
  x,
  y,
  content,
  checkersArray,
  isKing,
}: {
  x: number;
  y: number;
  checkersArray: SquareInputsArray;
  content: SquareContent;
  isKing?: boolean;
}): SquareInputsArray => {
  let array = [];
  const canMoveUp = content === "black" || isKing;
  const canMoveDown = content === "red" || isKing;
  if (canMoveUp) {
    const topLeftOption = coordsForValidMove({
      targetX: x - 1,
      targetY: y - 1,
      jumpX: x - 2,
      jumpY: y - 2,
      checkersArray,
      content,
    });
    if (Math.abs((topLeftOption?.x || 0) - x) > 1)
      return [topLeftOption] as SquareInputsArray; // jump option is only option
    if (topLeftOption) array.push(topLeftOption);
    const topRightOption = coordsForValidMove({
      targetX: x + 1,
      targetY: y - 1,
      jumpX: x + 2,
      jumpY: y - 2,
      checkersArray,
      content,
    });
    if (Math.abs((topRightOption?.x || 0) - x) > 1)
      return [topRightOption] as SquareInputsArray; // jump option is only option
    if (topRightOption) array.push(topRightOption);
  }
  if (canMoveDown) {
    const bottomLeftOption = coordsForValidMove({
      targetX: x - 1,
      targetY: y + 1,
      jumpX: x - 2,
      jumpY: y + 2,
      checkersArray,
      content,
    });
    if (Math.abs((bottomLeftOption?.x || 0) - x) > 1)
      return [bottomLeftOption] as SquareInputsArray; // jump option is only option
    if (bottomLeftOption) array.push(bottomLeftOption);
    const bottomRightOption = coordsForValidMove({
      targetX: x + 1,
      targetY: y + 1,
      jumpX: x + 2,
      jumpY: y + 2,
      checkersArray,
      content,
    });
    if (Math.abs((bottomRightOption?.x || 0) - x) > 1)
      return [bottomRightOption] as SquareInputsArray; // jump option is only option
    if (bottomRightOption) array.push(bottomRightOption);
  }
  return array;
};

export const getScore = (checkersArray: SquareInputsArray) => {
  return;
};
