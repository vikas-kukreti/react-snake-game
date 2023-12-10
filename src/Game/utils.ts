import { GRID_COLUMNS, GRID_ROWS, foodList } from "./constants";

export function randomXY() {
  return {
    x: Math.floor(Math.random() * GRID_COLUMNS),
    y: Math.floor(Math.random() * GRID_ROWS),
  };
}

export function randomFood() {
  return {
    ...randomXY(),
    emoji: foodList[Math.floor(foodList.length * Math.random())],
  };
}
