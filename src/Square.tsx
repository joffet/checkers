import { SquareContent, CheckerColor, SetHoverCoordinates } from "./Types";

export default function Square({
  x,
  y,
  isKing,
  index,
  content,
  setHoverCoordinates,
}: {
  x: number;
  y: number;
  isKing?: boolean | undefined;
  index: number;
  content: SquareContent;
  setHoverCoordinates: (coords: SetHoverCoordinates) => void;
}) {
  const isOnEvenRow = Math.ceil(index / 8 || 1) % 2 === 0;
  const isOnEvenColumn = (index % 8) % 2 === 0;
  const isLight =
    (isOnEvenColumn && isOnEvenRow) || (!isOnEvenColumn && !isOnEvenRow);

  const handleMouseEnter = () => {
    if (content === "red" || content === "black") {
      setHoverCoordinates({
        x,
        y,
        color: content as CheckerColor | "black",
        isKing: isKing || false,
      });
    }
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
