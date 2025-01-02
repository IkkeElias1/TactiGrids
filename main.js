import { initBoard, boardState, BOARD_SIZE } from "./board.js"; // Import BOARD_SIZE
import { getRandomPiece, applySpecialPieceEffect } from "./pieces.js";
import { checkForWin } from "./checkWin.js";
import { getCellDiv } from "./utils.js";
import { getNeighbors } from "./utils.js";


export let currentPlayer = "X";


export const playerHands = {
  X: [],
  O: [],
};


// =====================
// GAME INIT
// =====================
window.addEventListener("load", () => {
  initGame();
  document.getElementById("reset-btn").addEventListener("click", resetGame);
});

function initGame() {
  initBoard();
  initializePlayerHands();
  currentPlayer = "X";
  updateUI();
}

function resetGame() {
  initGame();
}

/**
 * Give 4 start pieces
 */
function initializePlayerHands() {
  playerHands.X = [];
  playerHands.O = [];
  for (let i = 0; i < 4; i++) {
    playerHands.X.push(getRandomPiece());
    playerHands.O.push(getRandomPiece());
  }
}

// =====================
// EVENTS
// =====================
export function onCellClick(e) {
  const row = parseInt(e.target.dataset.row, 10);
  const col = parseInt(e.target.dataset.col, 10);

  const cell = boardState[row][col];

  // Handle blocked field
  if (cell?.type === "blocked") {
    if (cell.owner !== currentPlayer) {
      alert("This field is blocked by your opponent!");
      return;
    } else {
      // Remove neighbour blocks
      removeBlockers(row, col, currentPlayer);
    }
  } else if (cell !== null) {
    alert("This space is occupied!");
    return;
  }

  // Make sure to have pieces on hand
  if (playerHands[currentPlayer].length === 0) {
    playerHands[currentPlayer].push(getRandomPiece());
  }

  // Chose the first piece in hand
  const chosenPiece = playerHands[currentPlayer].shift();

  // Place piece in boardState
  boardState[row][col] = {
    type: chosenPiece,
    owner: currentPlayer,
  };
  playerHands[currentPlayer].push(getRandomPiece());

  const cellDiv = e.target;
  renderPiece(cellDiv, chosenPiece, currentPlayer);

  applySpecialPieceEffect(chosenPiece, row, col, currentPlayer);

  if (chosenPiece !== "extra-turn") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  if (checkForWin(row, col)) {
    setTimeout(() => {
      alert(`Spiller ${boardState[row][col].owner} wins!`);
      resetGame();
    }, 100);
    return;
  }

  updateUI();
}

 // Remove block after placement
function removeBlockers(row, col, owner) {
  const neighbors = getNeighbors(row, col, 1); // Get all neighbours in a radius of 1

  neighbors.forEach(({ r, c }) => {
    const cell = boardState[r][c];
    if (cell?.type === "blocked" && cell.owner === owner) {
      // Remove block from boardState
      boardState[r][c] = null;

      const cellDiv = getCellDiv(r, c);
      cellDiv.textContent = "";
      cellDiv.style.backgroundColor = "#e2e2e2";
      cellDiv.style.cursor = "pointer";
    }
  });
}

// =====================
// HELPER FUNCTIONS
// =====================
function decrementBlockerTurns() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = boardState[row][col];
      if (cell?.type === "blocked") {
        cell.turnsLeft -= 1;

        if (cell.turnsLeft <= 0) {
          // Fjern blokkering
          boardState[row][col] = null;
          const cellDiv = getCellDiv(row, col);
          cellDiv.textContent = "";
          cellDiv.style.backgroundColor = "#e2e2e2"; // Tilbage til standard
          cellDiv.style.cursor = "pointer";
        }
      }
    }
  }
}

export function renderPiece(cellDiv, pieceType, owner) {
  // Fjern tidligere klasser og baggrunde
  cellDiv.textContent = owner || ""; // Hvis ingen owner, tom
  cellDiv.className = "cell"; // Rens klasser
  cellDiv.style.backgroundColor = "#e2e2e2"; // Sæt standard baggrund
  cellDiv.style.cursor = "pointer"; // Standard cursor

  // Tilføj specifikke klasser baseret på briktypen
  cellDiv.classList.add(`piece-${pieceType}`);

  // Hvis det er en blokeret brik, tilføj ejerspecifik baggrund
  if (pieceType === "blocked") {
    cellDiv.classList.add(`blocked`, `owner-${owner.toLowerCase()}`);
    cellDiv.style.backgroundColor = owner === "X" ? "#d9edf7" : "#f2dede";
  }
}

function updateUI() {
  document.getElementById("current-player").textContent = currentPlayer;
  const handUl = document.getElementById("player-hand");
  handUl.innerHTML = "";

  playerHands[currentPlayer].forEach((piece) => {
    const li = document.createElement("li");
    li.textContent = piece;
    li.classList.add(`piece-${piece}`);
    handUl.appendChild(li);
  });
}
