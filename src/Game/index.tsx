import { useState, useEffect, useRef } from "react";
import "./Game.css";
import {
  GRID_COLUMNS,
  GRID_ROWS,
  GRID_SIZE,
  MOVE,
  LOOPER_INTERVAL,
} from "./constants";
import { randomFood } from "./utils";

function Game() {
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const timer = useRef<number>();
  const snake = useRef([{ x: GRID_ROWS / 2, y: GRID_COLUMNS / 2 }]);
  const speed = useRef(0);
  const food = useRef(randomFood());

  const direction = useRef<MOVE>(MOVE.RIGHT);
  const [, updateFrame] = useState(0);

  function moveSnake() {
    const head = { ...snake.current[0] };
    switch (direction.current) {
      case MOVE.LEFT:
        head.x--;
        break;
      case MOVE.RIGHT:
        head.x++;
        break;
      case MOVE.UP:
        head.y--;
        break;
      default:
        head.y++;
        break;
    }
    snake.current.unshift(head);
    if (head.x === food.current.x && head.y === food.current.y) {
      food.current = randomFood();
    } else {
      snake.current.pop();
    }
  }

  function detectCollision() {
    const head = snake.current[0];
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_ROWS ||
      head.y >= GRID_COLUMNS
    ) {
      return gameOver();
    }
    for (let i = 1; i < snake.current.length; i++) {
      if (head.x == snake.current[i].x && head.y === snake.current[i].y) {
        return gameOver();
      }
    }
  }

  function gameOver() {
    clearInterval(timer.current);
    setOver(true);
    updateFrame(0);
  }

  function resetGame() {
    clearInterval(timer.current);
    snake.current = [{ x: GRID_ROWS / 2, y: GRID_COLUMNS / 2 }];
    food.current = randomFood();
    setOver(false);
    setStarted(false);
  }

  function gameLoop() {
    moveSnake();
    detectCollision();
    updateFrame((prev) => prev + 1);
  }

  function startGame() {
    if (started) {
      resetGame();
    }
    setStarted(true);
    timer.current = setInterval(gameLoop, LOOPER_INTERVAL - speed.current);
  }

  function handleKeypress(e: KeyboardEvent) {
    const keyMap: { [key: string]: () => void } = {
      " ": startGame,
      ArrowLeft: () => (direction.current = MOVE.LEFT),
      ArrowRight: () => (direction.current = MOVE.RIGHT),
      ArrowUp: () => (direction.current = MOVE.UP),
      ArrowDown: () => (direction.current = MOVE.DOWN),
    };
    if (e.key in keyMap) {
      keyMap[e.key]();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, []);

  function getSnakeHeadStyles() {
    const angle = [0, 90, 180, 270][direction.current];
    return {
      gap: GRID_SIZE / 5,
      width: GRID_SIZE,
      transform: `rotate(${angle}deg)`,
    };
  }

  function getItemStyles(c: { x: number; y: number }) {
    return {
      width: GRID_SIZE,
      height: GRID_SIZE,
      left: c.x * GRID_SIZE,
      top: c.y * GRID_SIZE,
      borderRadius: GRID_SIZE / 3,
      borderWidth: GRID_SIZE / 10,
      transitionDuration: `${LOOPER_INTERVAL - speed.current - 10}ms`,
    };
  }

  // if(snake.current.length > 6) clearInterval(timer.current);

  return (
    <div className="game-wrapper">
      <div className="game-playground">
        <div
          className="game-grid"
          style={{
            width: GRID_ROWS * GRID_SIZE,
            height: GRID_COLUMNS * GRID_SIZE,
            opacity: started && !over ? 1 : 0.2,
          }}
        >
          <div
            className="snake-food"
            key={snake.current.length}
            style={getItemStyles(food.current)}
          >
            {food.current.emoji}
          </div>
          {snake.current.map((c, i) => (
            <div key={i} className="snake-body" style={getItemStyles(c)}>
              {i === 0 ? (
                <div className="snake-head" style={getSnakeHeadStyles()}></div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {started && !over ? null : (
        <div className="game-menu">
          <h1>{over ? "Game Over" : "Snake Game"}</h1>
          <p>Press Spacebar to {over ? "Re-start" : "Start"}</p>
          <button onClick={startGame}>
            Click here to {over ? "Re-start" : "Start"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;
