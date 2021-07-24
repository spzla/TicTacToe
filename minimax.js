let scores = {
  X: 2,
  O: -1,
  tie: -1
}

function randomMove() {
  if(available.every((el) => el.every((e) => e == false))) return;

  let y = Math.floor(Math.random() * board.length);
  let x = Math.floor(Math.random() * board[0].length)

  board[y][x] = ai;
  available[y][x] = false;

  currentPlayer = player;
}

function bestMove() {
  if(available.every((el) => el.every((e) => e == false))) return;
  
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if(board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if(score > bestScore) {
          bestScore = score;
          move = { i, j }
        }
      }
    }
  }
  
  board[move.i][move.j] = ai;
  available[move.i][move.j] = false;

  currentPlayer = player;
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if(result !== null) {
    return scores[result];
  }

  if(isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';

          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[i][j] == '') {
          board[i][j] = player;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}