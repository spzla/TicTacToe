let scores = {
  X: 10,
  O: -10,
  tie: 0
}

function bestMove(random = false) {
  if(available.every((el) => el.every((e) => e == false))) return;
  
  let bestScore = -Infinity;
  let move;

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length; i++) {
      if(board[j][i] == '') {
        board[j][i] = ai;
        let score = minimax(board, 0, true);
        board[j][i] = '';
        if(score > bestScore) {
          bestScore = score;
          move = { j, i }
        }
      }
    }
  }
  
  if(random) {
    move = {
      j: Math.floor(Math.random() * board.length),
      i: Math.floor(Math.random() * board[0].length)
    };
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
    for (let j = 0; j < board.length; j++) {
      for (let i = 0; i < board[0].length; i++) {
        if(board[j][i] == '') {
          board[j][i] = ai;
          let score = minimax(board, depth + 1, alpha, beta, true);
          board[j][i] = '';
          
          bestScore = Math.max(score, bestScore);

          alpha = Math.max(alpha, score);
          if(beta <= alpha) break;
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length; i++) {
        if(board[j][i] == '') {
          board[j][i] = player1;
          let score = minimax(board, depth + 1, alpha, beta, false);
          board[j][i] = '';
          
          bestScore = Math.min(score, bestScore);

          beta = Math.min(beta, score);
          if(beta <= alpha) break;
        }
      }
    }
    return bestScore;
  }
}