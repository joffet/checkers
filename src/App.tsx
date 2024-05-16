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
  const [isRedTurn, setIsRedTurn] = useState(false);
  const [checkersArray, setCheckersArray] = useState(initCheckersArray);
  const [dragValues, setDragValues] = useState<DragValues>(initDragValues);
  const [squareBeingDragged, setSquareBeingDragged] = useState<
    SquareInputs | undefined
  >(undefined);
  const [counterTime, setCounterTime] = useState("");

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
          isRedTurn,
        })
      );
    }
    return array;
  };

  const setHoverCoordinates = (square: SetHoverCoordinates) => {
    if (
      (square?.content === "red" && !isRedTurn) ||
      (square?.content === "black" && isRedTurn)
    )
      return;
    let eligibleDestinationsArray: SquareInputsArray = [];
    if (square) {
      eligibleDestinationsArray = getEligibleMovesArray({
        x: square.x,
        y: square.y,
        content: square.content,
        checkersArray,
        isKing: square.isKing,
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
    const targetX = dragValues.hoverX;
    const targetY = dragValues.hoverY;
    const targetContent = checkersArray.find(
      (e) => e.x === targetX && e.y === targetY
    )?.content;
    if (targetContent === "eligibleDestination") {
      const sourceX = squareBeingDragged?.x || 0;
      const sourceY = squareBeingDragged?.y || 0;

      // check if the move was a jump
      const isJump = Math.abs(targetX - (sourceX || 0)) > 1;
      const jumpedCheckerCoords = {
        x: sourceX > targetX ? sourceX - 1 : sourceX + 1,
        y: sourceY > targetY ? sourceY - 1 : sourceY + 1,
      };
      const newCheckersArray = checkersArray.filter(
        (e) =>
          e.content !== "eligibleDestination" &&
          !(e.x === sourceX && e.y === sourceY) &&
          // if was a jump, then remove the jumped checker
          !(
            isJump &&
            e.x === jumpedCheckerCoords.x &&
            e.y === jumpedCheckerCoords.y
          )
      );
      newCheckersArray.push({
        x: targetX,
        y: targetY,
        content: squareBeingDragged?.content,
      });
      setCheckersArray(newCheckersArray);
      setIsRedTurn(!isRedTurn);
    }
    setSquareBeingDragged(undefined); // reset square being dragged
    setDragValues(initDragValues); // reset dragging values
  };

  // game timer
  useEffect(() => {
    let counter = 0;
    const getString = (value: number) => {
      if (value === 0) return "00";
      if (value < 10) return `0${value}`;
      return value.toString();
    };
    const incrementSeconds = () => {
      counter += 1;
      const hours = Math.floor(counter / 3600);
      const minutes = Math.floor(counter / 60);
      const seconds = counter % 60;
      setCounterTime(
        `${getString(hours)}:${getString(minutes)}:${getString(seconds)}`
      );
      setTimeout(incrementSeconds, 1000);
    };
    incrementSeconds();
  }, []);

  return (
    <div className="Container">
      <div>
        <div className="Side-space">
          <div
            style={{ display: !isRedTurn ? "none" : "" }}
            className="Turn-banner Turn-banner-red"
          >
            Rey's Turn
          </div>
        </div>
        <img src="rey.png" className="Headshot" alt="Rey" />
        <div className="Side-space">
          <div className="Checker Checker-red Checker-score">
            {12 - checkersArray.filter((e) => e.content === "black").length}
          </div>
          <div className="End-column">
            <button className="Button-red">{counterTime}</button>
            <button className="Button-red">Give in to the Dark Side</button>
          </div>
        </div>
      </div>
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
      <div>
        <div className="Side-space">
          <div
            style={{ display: isRedTurn ? "none" : "" }}
            className="Turn-banner Turn-banner-black"
          >
            Kylo's Turn
          </div>
        </div>
        <img src="kylo.png" className="Headshot" alt="Kylo" />
        <div className="Side-space">
          <div className="Checker Checker-black Checker-score">
            {12 - checkersArray.filter((e) => e.content === "red").length}
          </div>
          <div className="End-column">
            <button className="Button-black">Give in to the Light Side</button>
            <button className="Button-black">Reset Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
