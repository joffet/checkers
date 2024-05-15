import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import "./App.css";

const initRedCheckersArray = [
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

const initBlackCheckersArray: SquareInputsArray = [
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

type SquareInputs = {
  x: number;
  y: number;
  isKing?: boolean;
  index?: number;
  content?: SquareContent;
};

type SquareInputsArray = [] | SquareInputs[];

type SquareContent = "red" | "black" | "destination" | undefined;

export default function App() {
  const [redCheckersArray, setRedCheckersArray] =
    useState(initRedCheckersArray);
  const [blackCheckersArray, seBlackCheckersArray] =
    useState<SquareInputsArray>(initBlackCheckersArray);
  const [eligibleDestinationsArray, setEligibleDestinationsArray] =
    useState<SquareInputsArray>([]);
  const [hoverCoordinates, setHoverCoordinates] = useState<
    SquareInputs | undefined
  >();

  const squareContent = (x: number, y: number): SquareContent => {
    if (isCoordsInArray(x, y, eligibleDestinationsArray)) return "destination";
    if (isCoordsInArray(x, y, redCheckersArray)) return "red";
    if (isCoordsInArray(x, y, blackCheckersArray)) return "black";
    return undefined;
  };

  const isCoordsInArray = (x: number, y: number, array: SquareInputsArray) => {
    let result = false;
    for (let index = 0; index < array.length; index++) {
      const dest: SquareInputs = array[index];
      if (dest.x === x && dest.y === y) {
        result = true;
        break;
      }
    }
    return result;
  };

  const getSquaresArray = () => {
    const array: Array<ReactNode> = [];
    for (let index = 1; index < 65; index++) {
      const x = index % 8 || 8;
      const y = Math.ceil(index / 8);
      array.push(
        Square({
          x,
          y,
          index,
          content: squareContent(x, y),
          setHoverCoordinates,
        })
      );
    }
    return array;
  };

  return (
    <div className="Container">
      <div className="Board-Outer">
        <div className="Board-Inner">{getSquaresArray()}</div>
      </div>
    </div>
  );
}

function Square({
  x,
  y,
  isKing,
  index,
  content,
  setHoverCoordinates,
}: {
  x: number;
  y: number;
  isKing?: boolean;
  index: number;
  content: SquareContent;
  setHoverCoordinates: Dispatch<SetStateAction<SquareInputs | undefined>>;
}) {
  const isOnEvenRow = Math.ceil(index / 8 || 1) % 2 === 0;
  const isOnEvenColumn = (index % 8) % 2 === 0;
  const isLight =
    (isOnEvenColumn && isOnEvenRow) || (!isOnEvenColumn && !isOnEvenRow);

  const handleMouseEnter = () => {
    if (content !== "red" && content !== "black") return;
    setHoverCoordinates({ x, y });
  };

  const handleMouseLeave = () => {
    if (content !== "red" && content !== "black") return;
    setHoverCoordinates(undefined);
  };

  return (
    <div
      className={`Square ${isLight ? "Square-Light" : "Square-Dark"}`}
      key={index}
    >
      {content && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`Checker Checker-${content}`}
        ></div>
      )}
    </div>
  );
}
