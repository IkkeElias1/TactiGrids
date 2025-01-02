import { onCellClick } from "./main.js"; 

export const BOARD_SIZE = 7;

// Board state: 2D-array
export let boardState = [];

/**
 * Creates an empty 7x7 array.
 * Returns boardState
 */
export function initBoard() {
  boardState = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    boardState[row] = new Array(BOARD_SIZE).fill(null);
  }

  const boardDiv = document.getElementById("board");
  if (!boardDiv) {
    console.error("Board div not found in DOM!");
    return;
  }

  boardDiv.innerHTML = "";

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.row = row;
      cellDiv.dataset.col = col;
      cellDiv.addEventListener("click", onCellClick);
      boardDiv.appendChild(cellDiv);
    }
  }
  return boardState;
}

/**
 * Reset the board
 */
export function resetBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      boardState[row][col] = null;
      const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (cellDiv) {
        cellDiv.textContent = "";
        cellDiv.style.backgroundColor = "#e2e2e2";
        cellDiv.style.cursor = "pointer";
      }
    }
  }
}
