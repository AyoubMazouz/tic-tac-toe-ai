const cellsDiv = document.getElementById("cells");
const cells = cellsDiv.querySelectorAll("button");
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
        for (let j = 0; j < 3; j++)
            if (game.board[i][j] === "") temp.push([j, i]);
    } return temp;
}

const IsBoardFull = () => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++)
            if (game.board[i][j] === '') return false;
    } return true;
}

const areEqual = (arr1, arr2) => {
    return (JSON.stringify(arr1) === JSON.stringify(arr2));
}

const checkWin = () => {
    const human = ["X", "X", "X"];
    const ai = ["O", "O", "O"];
    const b = game.board;
    let [step, temp] = [0, []];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            if (step >= 3) temp.push(b[j][step - 3]); // Column / Y.
            else temp.push(b[step][j]);               // Row / X.
        }
        if (areEqual(temp, human)) return "human";
        else if (areEqual(temp, ai)) return "ai";
        step++;
        temp = [];
    } // Diagonal.
    if (areEqual([b[0][0], b[1][1], b[2][2]], human)) return "human"; // \
    if (areEqual([b[0][0], b[1][1], b[2][2]], ai)) return "ai";       // \
    if (areEqual([b[2][0], b[1][1], b[0][2]], human)) return "human"; // /
    if (areEqual([b[2][0], b[1][1], b[0][2]], ai)) return "ai";       // /
    if (IsBoardFull()) return "tie";
    return false;
}

const updateDisplay = () => {
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
const stats = { "human": -10, "ai": 10, "tie": 0 };
const aiMove = () => {
    if (IsBoardFull()) return;
    const availablePos = getAvailablePos();
    let bestScore = -Infinity;
    let move;
    for (let pos of availablePos) {
        game.board[pos[1]][pos[0]] = "O";
        score = minimax(game.board, false, 4);
        game.board[pos[1]][pos[0]] = "";
        if (score > bestScore) [bestScore, move] = [score, pos];
    }
    game.turn = !game.turn;
    game.board[move[1]][move[0]] = "O";
}
const minimax = (board, isMaximizing, depth) => {
    const result = checkWin();
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


const humanMove = pos => {
    const [x, y] = [parseInt(pos[0]), parseInt(pos[1])];
    if (!IsEmpty(x, y)) return;
    if (game.turn) {
        game.board[y][x] = "X";
        game.turn = !game.turn;
    }
}

const update = async pos => {
    if (game.turn) humanMove(pos);
    else {
        console.time();
        aiMove();
        console.timeEnd();
    }
    updateDisplay();
    if (checkWin()) {
        label.innerText = checkWin();
        await reset();
        updateDisplay();
    }
    if (!game.turn) update();
}


cellsDiv.addEventListener("click", event => {
    if (event.target.id !== "cells") update(event.target.dataset.pos);
})
updateDisplay()