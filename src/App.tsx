import React, { ReactNode, useState } from "react";
import "./App.css";
import Square from "./Square";
import {
  CheckerColor,
  SetHoverCoordinates,
  SquareContent,
  SquareInputs,
  SquareInputsArray,
  initBlackCheckersArray,
  initRedCheckersArray,
} from "./Types";
import { getEligibleMovesArray } from "./Logic";

export default function App() {
  const [redCheckersArray, setRedCheckersArray] =
    useState(initRedCheckersArray);
  const [blackCheckersArray, seBlackCheckersArray] =
    useState<SquareInputsArray>(initBlackCheckersArray);
  const [eligibleDestinationsArray, setEligibleDestinationsArray] =
    useState<SquareInputsArray>([]);

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

  const setHoverCoordinates = (coords: SetHoverCoordinates) => {
    if (coords) {
      setEligibleDestinationsArray(
        getEligibleMovesArray({
          x: coords.x,
          y: coords.y,
          color: coords.color,
          redCheckersArray,
          blackCheckersArray,
          isKing: coords.isKing,
        })
      );
    } else {
      setEligibleDestinationsArray([]);
    }
  };

  return (
    <div className="Container">
      <div className="Board-Outer">
        <div className="Board-Inner">{getSquaresArray()}</div>
      </div>
    </div>
  );
}
