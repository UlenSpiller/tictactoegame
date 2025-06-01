const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || !gameActive) return;

  makeMove(index, 'X');

  if (checkGameEnd('X')) return;

  // Задержка перед ходом компьютера
  setTimeout(computerMove, 500);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function computerMove() {
  if (!gameActive) return;

  const emptyIndices = board
    .map((val, idx) => val === '' ? idx : null)
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  makeMove(randomIndex, 'O');

  checkGameEnd('O');
}

function checkGameEnd(player) {
  if (checkWin(player)) {
    statusText.textContent = `Победил: ${player}`;
    gameActive = false;
    return true;
  } else if (board.every(cell => cell !== '')) {
    statusText.textContent = 'Ничья!';
    gameActive = false;
    return true;
  } else {
    statusText.textContent = `Ходит: ${player === 'X' ? 'O' : 'X'}`;
    return false;
  }
}

function checkWin(player) {
  return winConditions.some(([a, b, c]) => {
    return board[a] === player && board[b] === player && board[c] === player;
  });
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => cell.textContent = '');
  statusText.textContent = 'Ходит: X';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
