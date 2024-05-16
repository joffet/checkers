import React, { ReactNode, RefObject, useRef, useState } from "react";
import "./App.css";
import Square from "./Square";
import {
  SetHoverCoordinates,
  SquareContent,
  SquareInputs,
  SquareInputsArray,
  initCheckersArray,
} from "./Types";
import { getEligibleMovesArray } from "./Logic";

export default function App() {
  const [checkersArray, setCheckersArray] = useState(initCheckersArray);
  const [dragValues, setDragValues] = useState({ top: 0, left: 0, width: 0 });
  const [squareBeingDragged, setSquareBeingDragged] = useState<
    SquareInputs | undefined
  >(undefined);
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>();

  const getSquareContent = (x: number, y: number): SquareContent => {
    const square = checkersArray.find((e) => e.x === x && e.y === y);
    return square?.content;
  };

  const setStartDragging = (square: SquareInputs) => {
    setSquareBeingDragged(square);
    rectRef.current = ref.current?.getBoundingClientRect();
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
          content: getSquareContent(x, y),
          setHoverCoordinates,
          setStartDragging,
          squareBeingDragged,
        })
      );
    }
    return array;
  };

  const setHoverCoordinates = (coords: SetHoverCoordinates) => {
    let eligibleDestinationsArray: SquareInputsArray = [];
    if (coords) {
      eligibleDestinationsArray = getEligibleMovesArray({
        x: coords.x,
        y: coords.y,
        content: coords.content,
        checkersArray,
        isKing: coords.isKing,
      });
    }
    const newCheckersArray = checkersArray.filter(
      (e) => e.content !== "eligibleDestination"
    );
    for (let index = 0; index < eligibleDestinationsArray.length; index++) {
      const squareData = Object.assign({}, eligibleDestinationsArray[index]);
      squareData.content = "eligibleDestination";
      newCheckersArray.push(squareData);
    }
    setCheckersArray(newCheckersArray);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const width = rectRef.current ? (rectRef.current.width / 8) * 0.7 : 0;
    setDragValues({
      top: e.pageY - (rectRef.current?.top || 0) - width / 2,
      left: e.pageX - (rectRef.current?.left || 0) - width / 2,
      width,
    });
  };

  document.addEventListener("mouseup", function handleMouseDown(e) {
    console.log("mouse up");
    console.log({ x: e.pageX - (rectRef.current?.left || 0) });
    setSquareBeingDragged(undefined);
  });

  return (
    <div className="Container">
      <div className="Board-Outer">
        <div ref={ref} className="Board-Inner" onMouseMove={handleMouseMove}>
          {getSquaresArray()}
          <div
            style={{
              height: dragValues.width,
              width: dragValues.width,
              position: "absolute",
              top: dragValues.top,
              left: dragValues.left,
              display: squareBeingDragged ? "block" : "none",
            }}
            className={`Checker Checker-${squareBeingDragged?.content}`}
          />
        </div>
      </div>
    </div>
  );
}
