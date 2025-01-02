import { boardState, BOARD_SIZE } from "./board.js";
import { getCellDiv, getNeighbors } from "./utils.js";
import { resetBoard } from "./board.js";
import { renderPiece } from "./main.js";


const PIECE_TYPES = [
  { type: "normal", probability: 40 },
  { type: "blocker", probability: 20 },
  { type: "bomb", probability: 10 },
  { type: "swapper", probability: 10 },
  { type: "extra-turn", probability: 10 },
  { type: "resetter", probability: 5 },
  { type: "ultimate-swapper", probability: 3 },
  { type: "fighter", probability: 2 },
];

export function getRandomPiece() {
  const total = PIECE_TYPES.reduce((acc, p) => acc + p.probability, 0);
  const rand = Math.floor(Math.random() * total);
  let cumSum = 0;
  for (let piece of PIECE_TYPES) {
    cumSum += piece.probability;
    if (rand < cumSum) {
      return piece.type;
    }
  }
  return "normal";
}

export function applySpecialPieceEffect(pieceType, row, col, owner) {
  switch (pieceType) {
    case "blocker":
      blockNearbyCells(row, col, owner);
      break;
    case "resetter":
      resetBoard();
      break;
    case "ultimate-swapper":
      triggerUltimateSwapper(owner);
      break;
    case "swapper":
      triggerSwapper(row, col, owner);
      break;
    default:
      break;
  }
}

function blockNearbyCells(row, col, owner) {
  const neighbors = getNeighbors(row, col, 1);
  neighbors.forEach(({ r, c }) => {
    const cell = boardState[r][c];
    if (cell?.type === "blocked" && cell.owner !== owner) {
      boardState[r][c] = null;
      const cellDiv = getCellDiv(r, c);
      cellDiv.textContent = "";
      cellDiv.style.backgroundColor = "#e2e2e2";
      cellDiv.style.cursor = "pointer";
    } else if (!cell) {
      boardState[r][c] = {
        type: "blocked",
        owner: owner,
        turnsLeft: 5,
      };
      const cellDiv = getCellDiv(r, c);
      cellDiv.textContent = "X";
      cellDiv.style.backgroundColor = owner === "X" ? "#d9edf7" : "#f2dede";
      cellDiv.style.cursor = "not-allowed";
    }
  });
}

function triggerUltimateSwapper(owner) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = boardState[row][col];
      if (cell && cell.owner && cell.type !== "blocked") {
        // Byt ejerskab mellem X og O
        cell.owner = cell.owner === "X" ? "O" : "X";
        const cellDiv = getCellDiv(row, col);
        renderPiece(cellDiv, cell.type, cell.owner);
      }
    }
  }
}

function triggerSwapper(row, col, owner) {
  const neighbors = getNeighbors(row, col, 1);

  neighbors.forEach(({ r, c }) => {
    const cell = boardState[r][c];

    if (cell && cell.owner && cell.type !== "blocked") {
      // Byt ejerskab mellem spillere (X ? O)
      cell.owner = cell.owner === "X" ? "O" : "X";

      // Opdater UI
      const cellDiv = getCellDiv(r, c);
      renderPiece(cellDiv, cell.type, cell.owner);
    }
  });

  // Turn swapper into normal piece after use
  boardState[row][col] = {
    type: "normal",
    owner: owner,
  };
  const cellDiv = getCellDiv(row, col);
  renderPiece(cellDiv, "normal", owner);
}


