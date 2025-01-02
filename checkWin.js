// checkWin.js

import { boardState, BOARD_SIZE } from "./board.js";

/**
 * Check if last move was (row, col) which is 4 in a row
 * @param {number} row - Row for last move
 * @param {number} col - Column for last move
 * @returns {boolean} - True, if its 4 in a row
 */
export function checkForWin(row, col) {
  const cell = boardState[row][col];
  if (!cell || !cell.owner || cell.type === "blocked") {
    return false; // Hvis feltet er blokeret eller tomt
  }
  const owner = cell.owner;

  /**
   * Check if its owned by the correct player
   */
  function isOwned(r, c) {
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    const data = boardState[r][c];
    return data && data.owner === owner && data.type !== "blocked";
  }

    const directions = [
    { dr: 0, dc: 1 },   // Vandret (højre/venstre)
    { dr: 1, dc: 0 },   // Lodret (op/ned)
    { dr: 1, dc: 1 },   // Diagonal (ned-højre/op-venstre)
    { dr: 1, dc: -1 },  // Diagonal (ned-venstre/op-højre)
  ];

  for (let { dr, dc } of directions) {
    let count = 1;

    let r = row - dr, c = col - dc;
    while (isOwned(r, c)) {
      count++;
      r -= dr;
      c -= dc;
    }

    r = row + dr;
    c = col + dc;
    while (isOwned(r, c)) {
      count++;
      r += dr;
      c += dc;
    }

    if (count >= 4) {
      return true;
    }
  }

  return false;
}
