const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const cellsDiv = document.getElementById("cells");
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

const drawBoard = () => {
    ctx.fillStyle = '#eeee';
    ctx.fillRect(0, 0, w, h);
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
    ctx.beginPath();
    ctx.moveTo(x * s + p, y * s + p);
    ctx.lineTo(x * s + s - p, y * s + s - p);
    ctx.moveTo(x * s + p, y * s + s - p);
    ctx.lineTo(x * s + s - p, y * s + p);
    ctx.closePath();
    ctx.stroke();
}

const drawCircle = (x, y) => {
    ctx.beginPath();
    ctx.arc((x * s) + s / 2, (y * s) + s / 2, s / 2 - p, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}

const updateDisplay = () => {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (game.board[y][x] === "X")
                drawCross(x, y);
            else if (game.board[y][x] === "O")
                drawCircle(x, y)

        }
    }
}

const reset = () => {
    game = {
        turn: true,
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ],
    }
    updateDisplay();
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

const humanMove = (_x, _y) => {
    const [x, y] = getIndexPos(_x, _y)
    if (game.turn) {
        game.board[y][x] = "X";
        game.turn = !game.turn;
    }
}

const update = async (x, y) => {
    if (game.turn) humanMove(x, y);
    else {
        console.time();
        aiMove();
        console.timeEnd();
    }
    updateDisplay();
    if (checkWin()) {
        label.innerText = checkWin();
        reset();
        updateDisplay();
    }
    if (!game.turn) update(x, y);
}


canvas.addEventListener("click", e => update(e.clientX, e.clientY));
updateDisplay();
drawBoard();