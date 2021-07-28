let board = [];
let available = [];

let boardSize = 3;

const player1 = 'O';
const player2 = 'X';
const ai = player2;
let aiEnabled = true;
let uai = aiEnabled;
let currentPlayer;
let refreshId;

let gameInProgress;

createCanvas(500, 500);
const canvas = document.querySelector('canvas#ttt');
const checkbox = document.querySelector('input#useAi');
const resetButton = document.querySelector('input#resetButton');
const winnerP = document.querySelector('p#winner');


function createCanvas(w, h) {
  let canvas = document.createElement('canvas');
  canvas.id = 'ttt';
  canvas.width = w;
  canvas.height = h;
  document.querySelector('#canvasHolder').insertBefore(canvas, document.querySelector('#winner'));
}

function setup() {
  currentPlayer = ai;
  aiEnabled = uai;
  board = [];
  available = []

  for (let j = 0; j < boardSize; j++) {
    board.push([]);
    available.push([]);
    for (let i = 0; i < boardSize; i++) {
      board[j].push('');
      available[j].push(true);
    }
  }

  winnerP.innerHTML = '&nbsp;';

  refreshId = setInterval(() => {
    draw(canvas, board);
  }, 10);

  gameInProgress = true;
}

function equals3(a, b, c) {
  return (a == b && b == c && a != '');
}

function checkWinner() {
  let winner = null;
  
  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  if (winner == null && available.every((el) => el.every((e) => e == false))) {
    return 'tie';
  } else {
    return winner;
  }
}


function draw(canvas, board) {
  if(!gameInProgress) return; 
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let w = canvas.width / board[0].length;
  let h = canvas.height / board.length;

  let shapeSize = 1.5;
  let strokeColor = '#ccc';

  ctx.lineWidth = 4;

  if(currentPlayer == player1 && !aiEnabled) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#363636';
    ctx.stroke();
    ctx.closePath();
  }
  if(currentPlayer == player2 && !aiEnabled) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.strokeStyle = '#363636';
    ctx.stroke();
    ctx.closePath();
  }

  ctx.beginPath();

  ctx.moveTo(w, 0)
  ctx.lineTo(w, h * 3);
  ctx.moveTo(w * 2, 0)
  ctx.lineTo(w * 2, h * 3);
  
  ctx.moveTo(0, h)
  ctx.lineTo(w * 3, h);
  ctx.moveTo(0, h * 2)
  ctx.lineTo(w * 3, h * 2);

  ctx.strokeStyle = strokeColor;
  ctx.stroke();
  ctx.closePath();


  ctx.lineWidth = 4;

  ctx.beginPath();
  for (let j = 0; j < board.length - 1; j++) {
    ctx.moveTo(0, h + w * j)
    ctx.lineTo(w * board[0].length, h + h * j);
    for (let i = 0; i < board[0].length - 1; i++) {
      ctx.moveTo(w + w * i, 0)
      ctx.lineTo(w + w * i, h * board.length);
    }
  }
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
  ctx.closePath();

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length; i++) {
      let x = w * j + w / 2;
      let y = h * i + h / 2;
      spot = board[i][j];

      if(spot == player1) {
        ctx.beginPath();
        ctx.arc(x, y, w / (5 - shapeSize), 0, 2 * Math.PI);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.closePath();
      } else if (spot == ai) {
        let xr = w / (5 - shapeSize);
        ctx.beginPath();
        ctx.moveTo(x - xr, y - xr);
        ctx.lineTo(x + xr, y + xr);
        ctx.moveTo(x + xr, y - xr);
        ctx.lineTo(x - xr, y + xr);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  let result = checkWinner();
  if (result != null) {
    winnerP.style.width = `${canvas.width}px`;
    
    if(result == 'tie') {
      winnerP.innerText = 'Tie!';
    } else {
      winnerP.innerText = `${result} won!`;
    }
    
    gameInProgress = false;
    return;
  }
  
  if(!aiEnabled) { return; }
  if(currentPlayer == ai && available.every((el) => el.every((e) => e == true))) randomMove();
  if(currentPlayer == ai) bestMove();
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

checkbox.addEventListener('change', (e) => {
  uai = document.querySelector('input#useAi').checked;
});

resetButton.addEventListener('click', () => {
  setup();
  draw(canvas, board);
});

canvas.addEventListener('mousedown', (e) => {
  let { x, y } = getCursorPosition(canvas, e);

  let w = canvas.width / board[0].length;
  let h = canvas.height / board.length;

  x = Math.floor(x / w);
  y = Math.floor(y / h);

  if(!gameInProgress) return;
  if((currentPlayer != player1 && aiEnabled) || !board[y][x] == '') return;

  available[y].splice(x, 1, false);
  board[y][x] = currentPlayer;
  if(currentPlayer == player1) currentPlayer = player2;
  else currentPlayer = player1;

  if(aiEnabled) bestMove();
});

setup();