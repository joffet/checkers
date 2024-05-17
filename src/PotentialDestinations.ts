import {
  PotentialDestinations,
  SquareInputs,
  SquareInputsArray,
  jumpDifferentials,
  moveDifferentials,
} from "./Types";

const getTargetSquare = (
  square: SquareInputs,
  index: number,
  checkersArray: SquareInputsArray,
  isJump: boolean
): SquareInputs | undefined => {
  const { x, y, content, isKing } = square;
  const canMoveUp = content === "black" || !!isKing;
  const canMoveDown = content === "red" || !!isKing;
  if (index < 2 && !canMoveUp) return;
  if (index >= 2 && !canMoveDown) return;
  const differentials = isJump ? jumpDifferentials : moveDifferentials;
  const targetX = differentials[index].x + x;
  const targetY = differentials[index].y + y;
  if (targetX < 1 || targetX > 8 || targetY < 1 || targetY > 8) return;
  return (
    checkersArray.find((e) => e.x === targetX && e.y === targetY) || {
      x: targetX,
      y: targetY,
    }
  );
};

const getPotentialDestinationsForOneSquare = (
  square: SquareInputs,
  checkersArray: SquareInputsArray
) => {
  const array = [];
  const oppositeColor = square.content === "red" ? "black" : "red";
  let isJump = false;
  for (let index = 0; index < 4; index++) {
    let moveTarget = getTargetSquare(square, index, checkersArray, false);
    if (moveTarget?.content === square.content) return [];
    if (moveTarget?.content === oppositeColor) {
      isJump = true;
      moveTarget = getTargetSquare(square, index, checkersArray, true);
    }
    if (moveTarget?.content !== "red" && moveTarget?.content !== "black") {
      if (isJump && !!moveTarget) return [moveTarget];
    }
    if (!!moveTarget) array.push(moveTarget);
  }
  return array;
};

export const coordsToString = (square: SquareInputs): string => {
  return `${square.x}${square.y}`;
};

export const stringToCoords = (string: string) => {
  return { x: string.charAt(0), y: string.charAt(1) };
};

export const getAllPotentialDestinationsForOneColor = (
  color: string,
  checkersArray: SquareInputsArray
) => {
  // return checkersArray.reduce(
  //   (accumulator: PotentialDestinations, item: SquareInputs) => {
  //     const arrayOfDestinations = getPotentialDestinationsForOneSquare(item, checkersArray);
  //     if (arrayOfDestinations.length > 0) {
  //       accumulator[coordsToString(item)] = arrayOfDestinations;
  //     }
  //     return accumulator;
  //   },
  //   {} as PotentialDestinations
  // );
  const result: PotentialDestinations | {} = {};
  for (let index = 0; index < checkersArray.length; index++) {
    const item = checkersArray[index];
    if (item.content !== color) continue;
    const arrayOfDestinations = getPotentialDestinationsForOneSquare(
      item,
      checkersArray
    );
    if (
      arrayOfDestinations[0] &&
      Math.abs(arrayOfDestinations[0].x - item.x) > 1
    )
      return { [coordsToString(item)]: arrayOfDestinations }; // is a jump
    if (arrayOfDestinations.length > 0) {
      // @ts-ignore
      result[coordsToString(item)] = arrayOfDestinations;
    }
  }
  console.log({ result, color });
  return result;
};
