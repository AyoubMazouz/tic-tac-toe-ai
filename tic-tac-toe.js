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

const IsCellEmpty = (x, y) => !game.board[y][x];

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
    let temp = [];
    let step = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            // Column / Y
            if (step >= 3) {
                temp.push(game.board[j][step - 3]);
            }
            // Row / X
            else {
                temp.push(game.board[step][j]);
            }
        }
        if (areEqual(temp, ["X", "X", "X"])) {
            return "human";
        } else if (areEqual(temp, ["O", "O", "O"])) {
            return "ai";
        }
        temp = [];
        step++;
    } return false;
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
        }, 500);
    })
}

const ai = async () => {
    return (!IsBoardFull()) ? new Promise((resolve) => {
        setTimeout(() => {
            let x = Math.random() * 3 | 0;
            let y = Math.random() * 3 | 0;
            game.board[y][x] = "O";
            resolve()
        }, 100);
    }) : 1;
}

const human = pos => {
    const [x, y] = [parseInt(pos[0]), parseInt(pos[1])];
    if (!IsCellEmpty(x, y)) return;
    if (game.turn) {
        game.board[y][x] = "X";
    }
}

const update = async pos => {
    if (game.turn) human(pos);
    else await ai();
    game.turn = !game.turn;
    updateDisplay();
    if (checkWin()) {
        label.innerText = checkWin();
        await reset();
        return;
    }
    if (!game.turn) update(pos);
}




cellsDiv.addEventListener("click", event => {
    if (event.target.id !== "cells") {
        update(event.target.dataset.pos)
    }
})
updateDisplay()