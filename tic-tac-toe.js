const cellsDiv = document.getElementById("cells");
const label = document.getElementById("label");



var game = {
    turn: true,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
};

const IsEmpty = (x, y) => !game.board[y][x];

const getAvailablePos = () => {
    const temp = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.board[i][j] === "") {
                temp.push([j, i])
            }
        }
    } return temp
}

const IsBoardFull = () => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.board[i][j] === '') return false
        }
    } return true
}

const areEqual = (arr1, arr2) => {
    return (JSON.stringify(arr1) === JSON.stringify(arr2));
}

const checkWin = () => {
    const board = game.board;
    let temp = [];
    let step = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            // Column / Y
            if (step >= 3) {
                temp.push(board[j][step - 3]);
            }
            // Row / X
            else {
                temp.push(board[step][j]);
            }
        }
        if (areEqual(temp, ["X", "X", "X"])) {
            return "human";
        } else if (areEqual(temp, ["O", "O", "O"])) {
            return "ai";
        }
        temp = [];
        step++;
    }
    if (areEqual([board[0][0], board[1][1], board[2][2]], ["X", "X", "X"]))
        return "human";
    if (areEqual([board[0][0], board[1][1], board[2][2]], ["O", "O", "O"]))
        return "ai";
    if (areEqual([board[2][0], board[1][1], board[0][2]], ["X", "X", "X"]))
        return "human";
    if (areEqual([board[2][0], board[1][1], board[0][2]], ["O", "O", "O"]))
        return "ai"
    if (IsBoardFull()) return "tie";
    return false
}

const updateDisplay = () => {
    const cells = cellsDiv.querySelectorAll("button");
    let index = 0;
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            cells[index].innerText = game.board[y][x];
            index++;
        }
    }
}

const reset = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            game = {
                turn: true,
                board: [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ],
            }
            resolve();
            updateDisplay();
        }, 1000);
    })
}

// const ai = async () => {
//     return (!IsBoardFull()) ? new Promise((resolve) => {
//         setTimeout(() => {
//             let x = Math.random() * 3 | 0;
//             let y = Math.random() * 3 | 0;
//             game.board[y][x] = "O";
//             resolve()
//         }, 100);
//     }) : 1;
// }
const stats = { "human": -1, "ai": 1, "tie": 0 };
const aiMove = () => {
    if (IsBoardFull()) return;
    const availablePos = getAvailablePos();
    let bestScore = -Infinity;
    let bestMove;
    for (let pos of availablePos) {
        game.board[pos[1]][pos[0]] = "O";
        score = minimax(game.board, false, 3);
        game.board[pos[1]][pos[0]] = "";
        if (score > bestScore) {
            bestScore = score;
            bestMove = pos;
        }
    }
    console.log(bestMove)
    game.board[bestMove[1]][bestMove[0]] = "O";
}
const minimax = (board, isMaximizing, depth) => {
    // if (depth === 0) return;
    const result = checkWin();
    if (result) {
        return stats[result];
    }
    if (isMaximizing) {
        const availablePos = getAvailablePos();
        let bestScore = -Infinity;
        for (let pos of availablePos) {
            board[pos[1]][pos[0]] = "O";
            score = minimax(board, false, depth - 1);
            board[pos[1]][pos[0]] = "";
            if (score > bestScore) {
                bestScore = score;
            }
        } return bestScore;
    } else {
        const availablePos = getAvailablePos();
        let bestScore = Infinity;
        for (let pos of availablePos) {
            board[pos[1]][pos[0]] = "X";
            score = minimax(board, true, depth - 1);
            board[pos[1]][pos[0]] = "";
            if (score < bestScore) {
                bestScore = score;
            }
        } return bestScore;
    }
}

const humanMove = pos => {
    const [x, y] = [parseInt(pos[0]), parseInt(pos[1])];
    if (!IsEmpty(x, y)) return;
    if (game.turn) {
        game.board[y][x] = "X";
    }
}

const update = async pos => {
    if (game.turn) {
        humanMove(pos);
    } else {
        aiMove();
    }
    game.turn = !game.turn;
    updateDisplay();
    if (checkWin()) {
        label.innerText = checkWin();
        await reset();
        updateDisplay();
    }
    if (!game.turn) {
        update();
    }
}




cellsDiv.addEventListener("click", event => {
    if (event.target.id !== "cells") {
        update(event.target.dataset.pos)
    }
})
updateDisplay()