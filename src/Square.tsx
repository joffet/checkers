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
  triggerPotentialDestinations,
  setStartDragging,
  squareBeingDragged,
  dragValues,
  isRedTurn,
  isAutoOpponent,
}: {
  x: number;
  y: number;
  isKing?: boolean | undefined;
  index: number;
  content: SquareContent;
  triggerPotentialDestinations: (coords: SetHoverCoordinates) => void;
  setStartDragging: (arg0: SquareInputs) => void;
  squareBeingDragged: SquareInputs | undefined;
  dragValues: DragValues;
  isRedTurn: boolean;
  isAutoOpponent: boolean;
}) {
  const isOnEvenRow = Math.ceil(index / 8 || 1) % 2 === 0;
  const isOnEvenColumn = (index % 8) % 2 === 0;
  const isLight =
    (isOnEvenColumn && isOnEvenRow) || (!isOnEvenColumn && !isOnEvenRow);

  const handleMouseEnter = () => {
    if (content !== "red" && content !== "black") return;
    if (isAutoOpponent && isRedTurn) return;
    triggerPotentialDestinations({
      x,
      y,
      content,
      isKing: isKing || false,
    });
  };

  const handleMouseLeave = () => {
    if (content !== "red" && content !== "black") return;
    if (isAutoOpponent && isRedTurn) return;
    if (isThisCheckerBeingDragged) return;
    triggerPotentialDestinations(undefined);
  };

  const handleMouseDown = (squareInputs: SquareInputs) => {
    if (isAutoOpponent && isRedTurn) return;
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
