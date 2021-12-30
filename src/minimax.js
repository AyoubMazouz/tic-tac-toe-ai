const minimax = (board, isMaximizing, depth) => {
    const result = checkWin()[0];
    if (result) return stats[result];
    if (isMaximizing) {
        const availablePos = getAvailablePos();
        let bestScore = -Infinity;
        for (let pos of availablePos) {
            board[pos[1]][pos[0]] = "O";
            score = minimax(board, false, depth - 1);
            board[pos[1]][pos[0]] = "";
            bestScore = Math.max(score, bestScore);
        } return bestScore;
    } else {
        const availablePos = getAvailablePos();
        let bestScore = Infinity;
        for (let pos of availablePos) {
            board[pos[1]][pos[0]] = "X";
            score = minimax(board, true, depth - 1);
            board[pos[1]][pos[0]] = "";
            bestScore = Math.min(score, bestScore);
        } return bestScore;
    }
}