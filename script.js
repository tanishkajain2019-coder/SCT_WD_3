let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let isGameActive = true;
let isAiMode = true; 

const aiPlayer = 'O';
const humanPlayer = 'X';

const boardElement = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const gameModeSelect = document.getElementById('gameMode');
const cells = document.querySelectorAll('.cell');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Handle click events on grid cells
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    makeMove(clickedCellIndex, currentPlayer);
    
    if (checkResult(boardState, currentPlayer)) return;

    if (isAiMode) {
        currentPlayer = aiPlayer;
        statusDisplay.innerHTML = "AI is thinking...";
        // Tiny timeout makes the AI feel slightly more human instead of instantly updating
        setTimeout(() => {
            if (isGameActive) computerTurn();
        }, 400);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add('taken');
    
    // Aesthetic accent colors
    if (player === 'X') {
        cells[index].style.color = '#00b3ff';
    } else {
        cells[index].style.color = '#ff3366';
    }
}

function computerTurn() {
    const bestIndex = findBestMove(boardState);
    if (bestIndex !== -1) {
        makeMove(bestIndex, aiPlayer);
        if (checkResult(boardState, aiPlayer)) return;
        currentPlayer = humanPlayer;
        statusDisplay.innerHTML = "Your turn (X)";
    }
}

function checkResult(board, player) {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = isAiMode && player === aiPlayer ? "AI Wins! Unbeatable." : `Player ${player} Wins!`;
        isGameActive = false;
        return true;
    }

    if (!board.includes("")) {
        statusDisplay.innerHTML = "It's a Draw!";
        isGameActive = false;
        return true;
    }

    return false;
}

// Minimax Algorithm Functions
function evaluateBoard(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === aiPlayer ? 10 : -10;
        }
    }
    return 0;
}

function minimax(board, depth, isMax) {
    let score = evaluateBoard(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!board.includes("")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = aiPlayer;
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = humanPlayer;
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = aiPlayer;
            let moveVal = minimax(board, 0, false);
            board[i] = "";

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

// Game Mode Switch (Reset upon changing modes)
gameModeSelect.addEventListener('change', (e) => {
    isAiMode = e.target.value === 'ai';
    resetGame();
});

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusDisplay.innerHTML = "Your turn (X)";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('taken');
        cell.style.color = '';
    });
}

// Attach listeners
boardElement.addEventListener('click', handleCellClick);
resetBtn.addEventListener('click', resetGame);