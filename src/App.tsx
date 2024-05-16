import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./App.css";
import Square from "./Square";
import {
  DragValues,
  SetHoverCoordinates,
  SquareContent,
  SquareInputs,
  SquareInputsArray,
  initCheckersArray,
  initDragValues,
} from "./Types";
import { getEligibleMovesArray } from "./Logic";

export default function App() {
  // state
  const [checkersArray, setCheckersArray] = useState(initCheckersArray);
  const [dragValues, setDragValues] = useState<DragValues>(initDragValues);
  const [squareBeingDragged, setSquareBeingDragged] = useState<
    SquareInputs | undefined
  >(undefined);

  // refs
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>();

  const getSquareContent = (x: number, y: number): SquareContent => {
    const square = checkersArray.find((e) => e.x === x && e.y === y);
    return square?.content;
  };

  const setStartDragging = (square: SquareInputs) => {
    setSquareBeingDragged(square);
    rectRef.current = ref.current?.getBoundingClientRect(); // update the position of the board relative the viewport
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
          dragValues,
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
    if (!squareBeingDragged) return;
    const width = rectRef.current ? (rectRef.current.width / 8) * 0.7 : 0;
    const baseX = e.pageY - (rectRef.current?.top || 0);
    const baseY = e.pageX - (rectRef.current?.left || 0);

    const hoverX = Math.ceil((baseY / (rectRef.current?.width || 1)) * 8);
    const hoverY = Math.ceil((baseX / (rectRef.current?.height || 1)) * 8);
    setDragValues({
      top: baseX - width / 2,
      left: baseY - width / 2,
      width,
      hoverX,
      hoverY,
    });
  };

  const handleMouseUp = () => {
    const targetContent = checkersArray.find(
      (e) => e.x === dragValues.hoverX && e.y === dragValues.hoverY
    )?.content;
    if (targetContent === "eligibleDestination") {
      const sourceX = squareBeingDragged?.x;
      const sourceY = squareBeingDragged?.y;
      const newCheckersArray = checkersArray.filter(
        (e) =>
          e.content !== "eligibleDestination" &&
          ((e.x !== sourceX && e.y === sourceY) ||
            (e.x === sourceX && e.y !== sourceY) ||
            (e.x !== sourceX && e.y !== sourceY))
      );
      // .map((e) => Object.assign({}, e));
      console.log({ newCheckersArray });
      newCheckersArray.push({
        x: dragValues.hoverX,
        y: dragValues.hoverY,
        content: squareBeingDragged?.content,
      });
      setCheckersArray(newCheckersArray);
    }
    setSquareBeingDragged(undefined); // reset square being dragged
    setDragValues(initDragValues); // reset dragging values
  };

  return (
    <div className="Container">
      <div className="Board-Outer">
        <div ref={ref} className="Board-Inner" onMouseMove={handleMouseMove}>
          {getSquaresArray()}

          {/* Dragging Checker */}
          <div
            onMouseUp={handleMouseUp}
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
