import React, { useState, useEffect, useRef } from 'react';

import { useInterval } from './useInterval';
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  DIRECTION_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from './constants';


const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [direction, setDirection] = useState(DIRECTION_START);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirection(DIRECTION_START);
    setSpeed(SPEED);
    setGameOver(false);
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  // condition makes sure that keycodes are 37, 38, 39, 40 so app doesn't crash
  const moveSnake = ({ keyCode }) => keyCode > 36 && keyCode < 41 && setDirection(DIRECTIONS[keyCode]);

  // apple is the square which the snake chases
  const createApple = () => apple.map((_, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));


  const checkCollision = (head, snk = snake) => {
    // check if snake collides with a wall
    if (
      head[0] * SCALE >= CANVAS_SIZE[0] ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVAS_SIZE[1] ||
      head[1] < 0
    ) return true;
    // check if snake collides with itself
    for (const piece of snk) {
      if (head[0] === piece[0] && head[1] === piece[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + direction[0], snakeCopy[0][1] + direction[1]];
    // make snake appear to crawl by adding "head" (first element of array) and removing "tail" (last element of array)
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy)
  };

  useInterval(() => gameLoop(), speed);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    // setTransform(a, b, c, d, e, f)
    // a - horizontal scaling
    // b - horizontal skewing
    // c - vertical skewing
    // d - vertical scaling
    // e - horizontal moving
    // f - vertical moving
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    // clearRect(x, y, width, height)
    // erases the pixels in a rectangular area by setting them to transparent black
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = 'pink';
    // draws a rectangle that is filled according to the current fillStyle
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = 'lightgreen';
    context.fillRect(apple[0], apple[1], 1,1);
  }, [snake, apple, gameOver])

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <canvas
        style={{ border: "solid 1px black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      >
      </canvas>
      {gameOver && <div>Game Over!</div>}
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};


export default App;
