let scores = {
  X: 1,
  O: -1,
  tie: 0
}

function randomMove() {
  if(available.every((el) => el.every((e) => e == false))) return;

  let y = Math.floor(Math.random() * board.length);
  let x = Math.floor(Math.random() * board[0].length)

  board[y][x] = ai;
  available[y][x] = false;

  currentPlayer = player1;
}

function bestMove() {
  if(available.every((el) => el.every((e) => e == false))) return;
  
  let bestScore = -Infinity;
  let move;

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if(board[j][i] == '') {
        board[j][i] = ai;
        let score = minimax(board, 0, false);
        board[j][i] = '';
        if(score > bestScore) {
          bestScore = score;
          move = { j, i }
        }
      }
    }
  }
  
  board[move.j][move.i] = ai;
  available[move.j][move.i] = false;

  currentPlayer = player1;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
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
          let score = minimax(board, depth + 1, alpha, beta, false);
          board[i][j] = '';
          
          bestScore = Math.max(score, bestScore);

          alpha = Math.max(alpha, score);
          if(beta <= alpha) break;
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[i][j] == '') {
          board[i][j] = player1;
          let score = minimax(board, depth + 1, alpha, beta, true);
          board[i][j] = '';
          
          bestScore = Math.min(score, bestScore);

          beta = Math.min(beta, score);
          if(beta <= alpha) break;
        }
      }
    }
    return bestScore;
  }
}