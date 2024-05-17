import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import Square from "./Square";
import {
  DragValues,
  PotentialDestinations,
  SetHoverCoordinates,
  SquareContent,
  SquareInputs,
  SquareInputsArray,
  initCheckersArray,
  initDragValues,
} from "./Types";
import {
  coordsToString,
  getAllPotentialDestinationsForOneColor,
  stringToCoords,
} from "./PotentialDestinations";

export default function App() {
  // state
  const [isRedTurn, setIsRedTurn] = useState(false);
  const [checkersArray, setCheckersArray] = useState(initCheckersArray);
  const [dragValues, setDragValues] = useState<DragValues>(initDragValues);
  const [squareBeingDragged, setSquareBeingDragged] = useState<
    SquareInputs | undefined
  >(undefined);
  const [counterTime, setCounterTime] = useState("");
  const [currentDestinations, setCurrentDestinations] = useState<
    PotentialDestinations | undefined
  >();
  const [isAutoOpponent, setIsAutoOpponent] = useState<boolean | undefined>();
  const [isSurrendered, setIsSurrendered] = useState<string | undefined>();

  // refs
  const innerBoardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>();

  const getSquareContent = (x: number, y: number): SquareContent => {
    const square = checkersArray.find((e) => e.x === x && e.y === y);
    return square?.content;
  };

  const swing = new Audio("./swing.mp3");
  const blaster = new Audio("./blaster.mp3");

  const setStartDragging = (square: SquareInputs) => {
    setSquareBeingDragged(square);
    rectRef.current = innerBoardRef.current?.getBoundingClientRect(); // update the position of the board relative the viewport
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
          triggerPotentialDestinations,
          setStartDragging,
          squareBeingDragged,
          dragValues,
          isRedTurn,
          isAutoOpponent: isAutoOpponent || false,
        })
      );
    }
    return array;
  };

  const resetPotentialDestinations = useCallback(() => {
    if (!currentDestinations)
      setCurrentDestinations(
        getAllPotentialDestinationsForOneColor(
          isRedTurn ? "red" : "black",
          checkersArray
        )
      );
  }, [checkersArray, currentDestinations, isRedTurn]);

  const triggerPotentialDestinations = (square: SetHoverCoordinates) => {
    if (
      (square?.content === "red" && !isRedTurn) ||
      (square?.content === "black" && isRedTurn)
    )
      return;
    resetPotentialDestinations();
    let eligibleDestinationsArray: SquareInputsArray = [];
    if (!!square)
      eligibleDestinationsArray = currentDestinations
        ? currentDestinations[coordsToString(square as SquareInputs)]
        : [];

    const newCheckersArray = checkersArray.filter(
      (e) => e.content !== "eligibleDestination"
    );
    if (eligibleDestinationsArray) {
      for (let index = 0; index < eligibleDestinationsArray.length; index++) {
        const squareData = Object.assign({}, eligibleDestinationsArray[index]);
        squareData.content = "eligibleDestination";
        newCheckersArray.push(squareData);
      }
      setCheckersArray(newCheckersArray);
    }
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
    executeCheckerMove(
      dragValues.hoverX,
      dragValues.hoverY,
      squareBeingDragged?.x || 0,
      squareBeingDragged?.y || 0
    );
  };

  const executeCheckerMove = useCallback(
    (targetX: number, targetY: number, sourceX: number, sourceY: number) => {
      const targetContent = checkersArray.find(
        (e) => e.x === targetX && e.y === targetY
      )?.content;
      if (targetContent === "eligibleDestination" || isAutoOpponent) {
        // check if the move was a jump
        const isJump = Math.abs(targetX - (sourceX || 0)) > 1;
        if (isJump) {
          blaster.play();
        } else {
          swing.play();
        }
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
        const newSquare = {
          x: targetX,
          y: targetY,
          content: squareBeingDragged?.content || "red", // red for auto move
          isKing: isNowKing({
            x: targetX,
            y: targetY,
            content: squareBeingDragged?.content || "red", // red for auto move
          }),
        };
        newCheckersArray.push(newSquare);
        setCheckersArray(newCheckersArray);
        setCurrentDestinations(undefined);
        setIsRedTurn(!isRedTurn);
      }

      setSquareBeingDragged(undefined); // reset square being dragged
      setDragValues(initDragValues); // reset dragging values
    },
    [checkersArray, isAutoOpponent, isRedTurn, squareBeingDragged?.content]
  );

  const isNowKing = (square: SquareInputs) => {
    const { y, content } = square;
    return (content === "red" && y === 8) || (content === "black" && y === 1);
  };

  // auto player turn
  useEffect(() => {
    if (!isRedTurn || !isAutoOpponent) return;
    setTimeout(() => {
      resetPotentialDestinations();
      if (!currentDestinations) return;
      const keys = Object.keys(currentDestinations);
      const key = keys[Math.floor(Math.random() * (keys.length - 1))];
      const checkerOptions = currentDestinations[key];
      const target =
        checkerOptions[Math.floor(Math.random() * (checkerOptions.length - 1))];
      const source = stringToCoords(key);
      executeCheckerMove(target.x, target.y, source.x, source.y);
    }, 500);
  }, [
    currentDestinations,
    executeCheckerMove,
    isAutoOpponent,
    isRedTurn,
    resetPotentialDestinations,
  ]);

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

  // get initial potential destinations
  useEffect(() => {
    setCurrentDestinations(
      getAllPotentialDestinationsForOneColor("black", checkersArray)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModalStartup = isAutoOpponent === undefined;
  const showModalRedWins =
    checkersArray.filter((e) => e.content === "black").length === 0 ||
    isSurrendered === "black";
  const showModalBlackWins =
    checkersArray.filter((e) => e.content === "red").length === 0 ||
    isSurrendered === "red";

  const resetGame = () => {
    setIsAutoOpponent(undefined);
    setIsRedTurn(false);
    setCheckersArray(initCheckersArray);
  };

  let upperPhotoString = "question.png";
  if (isAutoOpponent === true) upperPhotoString = "r2d2.png";
  if (isAutoOpponent === false) upperPhotoString = "rey.png";

  return (
    <div className="Container">
      <div>
        <div className="Side-space">
          <div
            style={{ display: !isRedTurn ? "none" : "" }}
            className="Turn-banner Turn-banner-red"
          >
            {`${isAutoOpponent === true ? "R2D2's Auto Move" : "Rey's Turn"}`}
          </div>
        </div>
        <img src={upperPhotoString} className="Headshot" alt="Rey" />
        <div className="Side-space">
          <div className="Checker Checker-red Checker-score">
            {12 - checkersArray.filter((e) => e.content === "black").length}
          </div>
          <div className="End-column">
            <button className="Button-red">{counterTime}</button>
            <button
              onMouseDown={() => setIsSurrendered("red")}
              className="Button-red"
            >
              Give in to the Dark Side
            </button>
          </div>
        </div>
      </div>
      <div className="Board-Outer">
        <div
          ref={innerBoardRef}
          className="Board-Inner"
          onMouseMove={handleMouseMove}
        >
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
            <button
              onMouseDown={() => setIsSurrendered("black")}
              className="Button-black Clickable"
            >
              Give in to the Light Side
            </button>
            <button onMouseDown={resetGame} className="Button-black Clickable">
              Reset Game
            </button>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      <div
        className="Overlay"
        style={{
          display:
            showModalBlackWins || showModalRedWins || showModalStartup
              ? ""
              : "none",
        }}
      >
        {/* Startup */}
        <div
          style={{ display: showModalStartup ? "" : "none" }}
          className="Modal"
        >
          <div className="Modal-line">Welcome to Star Checkers</div>
          <div className="Modal-line">
            You are the cunning Kylo Ren, playing Black
          </div>
          <div className="Modal-line">Your opponent can either be:</div>

          <div className="Modal-line">
            <img
              onMouseDown={() => setIsAutoOpponent(false)}
              src="rey.png"
              className="Headshot Clickable Border-highlight"
              alt="Rey"
            />
            <img
              onMouseDown={() => setIsAutoOpponent(true)}
              src="r2d2.png"
              className="Headshot Clickable Border-highlight"
              alt="Rey"
            />
          </div>
          <div style={{ marginTop: -10 }} className="Modal-line">
            <div style={{ marginRight: 60 }}>Human</div>
            <div>Computer</div>
          </div>
        </div>

        {/* Red Wins */}
        <div
          style={{
            display: showModalRedWins ? "" : "none",
            flexDirection: "row",
          }}
          className="Modal"
        >
          <div className="Modal-line">
            <img src={upperPhotoString} className="Headshot" alt="Rey" />
            <div className="Modal-line">
              {isAutoOpponent === true ? "R2D2 Wins!" : "Rey Wins!"}
            </div>
          </div>
        </div>

        {/* Black Wins */}
        <div
          style={{
            display: showModalBlackWins ? "" : "none",
            flexDirection: "row",
          }}
          className="Modal"
        >
          <div className="Modal-line">
            <img
              onMouseDown={() => setIsAutoOpponent(false)}
              src="kylo.png"
              className="Headshot"
              alt="Kylo"
            />
            <div className="Modal-line">Kylo Wins!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
