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

export const isSquareOpen = (square: SquareInputs | undefined) => {
  if (!square) return false;
  return square?.content !== "red" && square?.content !== "black";
};

const getPotentialDestinationsForOneSquare = (
  square: SquareInputs,
  checkersArray: SquareInputsArray
) => {
  const array = [];
  const oppositeColor = square.content === "red" ? "black" : "red";
  for (let index = 0; index < 4; index++) {
    let moveTarget = getTargetSquare(square, index, checkersArray, false);

    if (moveTarget?.content === square.content) continue; // occupied by same color - invalid
    if (moveTarget?.content === oppositeColor) {
      // occupied by opposite color
      moveTarget = getTargetSquare(square, index, checkersArray, true); // check for opening at jump destinations
      if (isSquareOpen(moveTarget)) {
        return [moveTarget]; // return just this target if jump is valid
      } else {
        moveTarget = undefined; // if jump invalid, then remove target
      }
    }

    if (!!moveTarget) array.push(moveTarget);
  }

  return array;
};

export const coordsToString = (square: SquareInputs): string => {
  return `${square.x}${square.y}`;
};

export const stringToCoords = (string: string) => {
  return { x: parseInt(string.charAt(0)), y: parseInt(string.charAt(1)) };
};

export const getAllPotentialDestinationsForOneColor = (
  color: string,
  checkersArray: SquareInputsArray
) => {
  // This reduce function has some critial typescript errors that were taking a long time to resolve. I rewrote it as a loop to get the function working. I'll come back, if I have time, to resolve the TS errors and replace the loop.

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
    const square = checkersArray[index];
    if (square.content !== color) continue;

    const arrayOfDestinations = getPotentialDestinationsForOneSquare(
      square,
      checkersArray
    );

    if (
      arrayOfDestinations[0] &&
      Math.abs(arrayOfDestinations[0].x - square.x) > 1
    )
      return { [coordsToString(square)]: arrayOfDestinations }; // is a jump
    if (arrayOfDestinations.length > 0) {
      // @ts-ignore
      result[coordsToString(square)] = arrayOfDestinations;
    }
  }
  return result;
};
