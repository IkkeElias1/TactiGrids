import { BOARD_SIZE } from "./board.js";

export function getCellDiv(row, col) {
  const index = row * BOARD_SIZE + col;
  return document.querySelectorAll(".cell")[index];
}

export function getNeighbors(row, col, distance = 1) {
  const neighbors = [];
  for (let r = row - distance; r <= row + distance; r++) {
    for (let c = col - distance; c <= col + distance; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        neighbors.push({ r, c });
      }
    }
  }
  return neighbors;
}
