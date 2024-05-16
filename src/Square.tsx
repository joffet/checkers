import { SquareContent, SetHoverCoordinates, SquareInputs } from "./Types";

export default function Square({
  x,
  y,
  isKing,
  index,
  content,
  setHoverCoordinates,
  setStartDragging,
  squareBeingDragged,
}: {
  x: number;
  y: number;
  isKing?: boolean | undefined;
  index: number;
  content: SquareContent;
  setHoverCoordinates: (coords: SetHoverCoordinates) => void;
  setStartDragging: (arg0: SquareInputs) => void;
  squareBeingDragged: SquareInputs | undefined;
}) {
  // const [isDraggingSource, setIsDraggingSource] = setState(false);
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
    setHoverCoordinates(undefined);
  };

  const handleMouseDown = (squareInputs: SquareInputs) => {
    if (content !== "red" && content !== "black") return;
    setStartDragging(squareInputs);
    // setIsDraggingSource(true);
  };

  const isThisCheckerBeingDragged =
    squareBeingDragged &&
    squareBeingDragged.x === x &&
    squareBeingDragged.y === y;

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
          className={`Checker Checker-${content}`}
          style={{ display: isThisCheckerBeingDragged ? "none" : "" }}
        ></div>
      )}
    </div>
  );
}
function setState(arg0: boolean): [any, any] {
  throw new Error("Function not implemented.");
}
