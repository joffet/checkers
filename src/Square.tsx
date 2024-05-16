import { useState } from "react";
import {
  SquareContent,
  SetHoverCoordinates,
  SquareInputs,
  DragValues,
} from "./Types";

export default function Square({
  x,
  y,
  isKing,
  index,
  content,
  setHoverCoordinates,
  setStartDragging,
  squareBeingDragged,
  dragValues,
  isRedTurn,
}: {
  x: number;
  y: number;
  isKing?: boolean | undefined;
  index: number;
  content: SquareContent;
  setHoverCoordinates: (coords: SetHoverCoordinates) => void;
  setStartDragging: (arg0: SquareInputs) => void;
  squareBeingDragged: SquareInputs | undefined;
  dragValues: DragValues;
  isRedTurn: boolean;
}) {
  const isOnEvenRow = Math.ceil(index / 8 || 1) % 2 === 0;
  const isOnEvenColumn = (index % 8) % 2 === 0;
  const isLight =
    (isOnEvenColumn && isOnEvenRow) || (!isOnEvenColumn && !isOnEvenRow);

  const handleMouseEnter = () => {
    if (content !== "red" && content !== "black") return;
    setHoverCoordinates({
      x,
      y,
      content,
      isKing: isKing || false,
    });
  };

  const handleMouseLeave = () => {
    if (content !== "red" && content !== "black") return;
    if (isThisCheckerBeingDragged) return;
    setHoverCoordinates(undefined);
  };

  const handleMouseDown = (squareInputs: SquareInputs) => {
    if ((content === "red" && isRedTurn) || (content === "black" && !isRedTurn))
      setStartDragging(squareInputs);
  };

  const isThisCheckerBeingDragged =
    squareBeingDragged &&
    squareBeingDragged.x === x &&
    squareBeingDragged.y === y;

  const isCheckerDroppable =
    content === "eligibleDestination" &&
    dragValues.hoverX === x &&
    dragValues.hoverY === y;

  return (
    <div
      className={`Square ${isLight ? "Square-Light" : "Square-Dark"}`}
      key={index}
    >
      {content && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => handleMouseDown({ x, y, content, isKing })}
          className={`Checker Checker-${
            isCheckerDroppable ? "droppable" : content
          }`}
          style={{ display: isThisCheckerBeingDragged ? "none" : "" }}
        ></div>
      )}
    </div>
  );
}
