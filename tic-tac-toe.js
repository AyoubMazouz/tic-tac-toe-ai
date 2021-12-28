const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart");
const label = document.getElementById("label");
const s = 200; // Size of each cell.
const p = 40; // Padding
const [w, h] = [s * 3, s * 3];
[canvas.width, canvas.height] = [w, h];
var game = {
    turn: true,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
};

const IsEmpty = (x, y) => !game.board[y][x];
const areEqual = (arr1, arr2) => (JSON.stringify(arr1) === JSON.stringify(arr2));

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

const getIndexPos = (x, y) => {
    const off = canvas.getBoundingClientRect();
    return [(x - off.x) / s | 0, (y - off.y) / s | 0];
}

const checkWin = () => {
    const human = ["X", "X", "X"];
    const ai = ["O", "O", "O"];
    const b = game.board;
    let [step, temp] = [0, []];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            if (step < 3) temp.push(b[step][j]);    // Row / X.
            else temp.push(b[j][step - 3]);         // Column / Y.
        }

        if (areEqual(temp, human))
            if (step < 3) return ["human", { start: [0, step], end: [2, step] }];
            else return ["human", { start: [step - 3, 0], end: [step - 3, 2] }];

        else if (areEqual(temp, ai))
            if (step < 3) ["ai", { start: [0, step], end: [2, step] }];
            else return ["ai", { start: [step - 3, 0], end: [step - 3, 2] }];

        [step, temp] = [step + 1, []];
    } // Diagonal.
    if (areEqual([b[0][0], b[1][1], b[2][2]], human))
        return ["human", { start: [0, 0], end: [2, 2] }]; // \
    if (areEqual([b[0][0], b[1][1], b[2][2]], ai))
        return ["ai", { start: [0, 0], end: [2, 2] }];     // \
    if (areEqual([b[2][0], b[1][1], b[0][2]], human))
        return ["human", { start: [0, 2], end: [2, 0] }]; // /
    if (areEqual([b[2][0], b[1][1], b[0][2]], ai))
        return ["ai", { start: [0, 2], end: [2, 0] }];      // /
    if (IsBoardFull()) return ["tie", null];
    return false;
}

const drawBoard = () => {
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    // Horizontal.
    ctx.moveTo(0, h / 3);
    ctx.lineTo(w, h / 3);
    ctx.moveTo(0, h * .66);
    ctx.lineTo(w, h * .66);
    // Vertical.
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.moveTo(w * .66, 0);
    ctx.lineTo(w * .66, h);
    ctx.closePath();
    ctx.stroke();
}

const drawCross = (x, y) => {
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(x * s + p, y * s + p);
    ctx.lineTo(x * s + s - p, y * s + s - p);
    ctx.moveTo(x * s + p, y * s + s - p);
    ctx.lineTo(x * s + s - p, y * s + p);
    ctx.closePath();
    ctx.stroke();
}

const drawCircle = (x, y) => {
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((x * s) + s / 2, (y * s) + s / 2, s / 2 - p, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}

const winningLine = pos => {
    const [x1, y1, x2, y2] = [...pos.start, ...pos.end];
    console.log(x1, y1, x2, y2)
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(x1 * s + s / 2, y1 * s + s / 2);
    ctx.lineTo(x2 * s + s / 2, y2 * s + s / 2);
    ctx.closePath();
    ctx.stroke();
}

const updateDisplay = () => {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, w, h);
    drawBoard();
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (game.board[y][x] === "X")
                drawCross(x, y);
            else if (game.board[y][x] === "O")
                drawCircle(x, y);
        }
    }
}

const reset = () => {
    debugger
    game.turn = true;
    game.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    updateDisplay();
}

const stats = { "human": -10, "ai": 10, "tie": 0 };
const aiMove = () => {
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

const humanMove = (_x, _y) => {
    const [x, y] = getIndexPos(_x, _y);
    if (!IsEmpty(x, y)) return;
    game.board[y][x] = "X";
    game.turn = !game.turn;
}

const update = (x, y) => {
    if (game.over) return;
    if (IsBoardFull()) return;
    if (game.turn) humanMove(x, y);
    else aiMove();
    updateDisplay();
    if (checkWin()) {
        const [winner, pos] = checkWin();
        label.innerText = winner;
        game.over = true;
        updateDisplay();
        winningLine(pos);
    }
    if (!game.turn) update(x, y);
}


canvas.addEventListener("click", e => update(e.clientX, e.clientY));
restartBtn.addEventListener("click", e => reset());
updateDisplay();