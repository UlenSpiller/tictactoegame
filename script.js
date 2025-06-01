const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // столбцы
  [0, 4, 8], [2, 4, 6]             // диагонали
];

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');
  if (!checkGameEnd('X')) {
    currentPlayer = 'O';
    setTimeout(computerMove, 500); // небольшая задержка
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
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
  }
  statusText.textContent = `Ходит: ${currentPlayer === 'X' ? 'O' : 'X'}`;
  return false;
}

function checkWin(player) {
  return winConditions.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

function computerMove() {
  if (!gameActive) return;

  const winIndex = findBestMove('O');
  if (winIndex !== null) {
    makeMove(winIndex, 'O');
    checkGameEnd('O');
    currentPlayer = 'X';
    return;
  }

  const blockIndex = findBestMove('X');
  if (blockIndex !== null) {
    makeMove(blockIndex, 'O');
    checkGameEnd('O');
    currentPlayer = 'X';
    return;
  }

  if (board[4] === '') {
    makeMove(4, 'O');
    checkGameEnd('O');
    currentPlayer = 'X';
    return;
  }

  const corners = [0, 2, 6, 8].filter(i => board[i] === '');
  if (corners.length > 0) {
    const corner = corners[Math.floor(Math.random() * corners.length)];
    makeMove(corner, 'O');
    checkGameEnd('O');
    currentPlayer = 'X';
    return;
  }

  const empty = board.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  if (empty.length > 0) {
    const random = empty[Math.floor(Math.random() * empty.length)];
    makeMove(random, 'O');
    checkGameEnd('O');
    currentPlayer = 'X';
  }
}

function findBestMove(player) {
  for (let [a, b, c] of winConditions) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(cell => cell === player).length === 2 && line.includes('')) {
      return [a, b, c][line.indexOf('')];
    }
  }
  return null;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = 'Ходит: X';
  cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
statusText.textContent = 'Ходит: X';
