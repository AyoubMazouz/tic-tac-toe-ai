const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart");
const playerScore = document.getElementById("player-score");
const aiScore = document.getElementById("ai-score");
const ties = document.getElementById("ties");
ctx.lineCap = 'round';

// Important data stored here.
var game = {
    player: 0, ai: 0, ties: 0,
    turn: true, over: false,
    x: null, y: null,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
};

// ####################################################
// ############ FUNCTIONS #############################
// ####################################################
const IsEmpty = (x, y) => !game.board[y][x];
const areEqual = (arr1, arr2) => (JSON.stringify(arr1) === JSON.stringify(arr2));

const getAvailablePos = () => {
    // Get all available positions.
    const temp = [];
    game.board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === "") temp.push([j, i]);
        });
    }); return temp;
}

const IsBoardFull = () => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++)
            if (game.board[i][j] === '') return false;
    } return true;
}

const getIndexPos = (x, y) => {
    // Calculate index out of mouse position.
    const off = canvas.getBoundingClientRect();
    return [(x - off.x) / s | 0, (y - off.y) / s | 0];
}


const checkWin = () => {
    const human = ["X", "X", "X"];
    const ai = ["O", "O", "O"];
    const b = game.board;
    let [step, temp] = [0, []];
    // For each row and column.
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
    }

    // For each diagonal position.
    if (areEqual([b[0][0], b[1][1], b[2][2]], human))
        return ["human", { start: [0, 0], end: [2, 2] }]; // \
    if (areEqual([b[0][0], b[1][1], b[2][2]], ai))
        return ["ai", { start: [0, 0], end: [2, 2] }];     // \
    if (areEqual([b[2][0], b[1][1], b[0][2]], human))
        return ["human", { start: [0, 2], end: [2, 0] }]; // /
    if (areEqual([b[2][0], b[1][1], b[0][2]], ai))
        return ["ai", { start: [0, 2], end: [2, 0] }];      // /
    if (IsBoardFull()) return ["tie", null];
    // If no one wins return false.
    return [false, null];
}

const recordPos = (_x, _y) => {
    // Get mouse position each frame to draw hover.
    game.pos = [_x, _y];
    [game.x, game.y] = getIndexPos(_x, _y);
}

// ####################################################
// ############ DRAW ##################################
// ####################################################
const drawBoard = () => {
    // Draw to horizontal & two vertical lines.
    ctx.strokeStyle = "rgba(0, 0, 0, .1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Horizontal.
    ctx.moveTo(p, h / 3);
    ctx.lineTo(w - p, h / 3);
    ctx.moveTo(p, h * .66);
    ctx.lineTo(w - p, h * .66);
    // Vertical.
    ctx.moveTo(w / 3, p);
    ctx.lineTo(w / 3, h - p);
    ctx.moveTo(w * .66, 0 + p);
    ctx.lineTo(w * .66, h - p);
    ctx.stroke();
}

const drawCross = (x, y, a) => {
    if (x === null) return
    ctx.lineWidth = 25;
    ctx.strokeStyle = `rgba(16, 185, 129, ${a || 1})`;
    ctx.beginPath();
    ctx.moveTo(x * s + p, y * s + p);
    ctx.lineTo(x * s + s - p, y * s + s - p);
    ctx.moveTo(x * s + p, y * s + s - p);
    ctx.lineTo(x * s + s - p, y * s + p);
    ctx.stroke();
}

const drawCircle = (x, y) => {
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 25;
    ctx.beginPath();
    ctx.arc((x * s) + s / 2, (y * s) + s / 2, s / 2 - p, 0, Math.PI * 2);
    ctx.stroke();
}

const winningLine = pos => {
    if (!pos) return;
    const [x1, y1, x2, y2] = [...pos.start, ...pos.end];
    ctx.lineWidth = 25;
    ctx.strokeStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.moveTo(x1 * s + s / 2, y1 * s + s / 2);
    ctx.lineTo(x2 * s + s / 2, y2 * s + s / 2);
    ctx.stroke();
}

const drawHoverCross = (x, y) => {
    if (x === null) return;
    if (IsEmpty(x, y)) drawCross(x, y, .1);
}

const draw = () => {
    // Clear canvas.
    ctx.fillStyle = "#ffff";
    ctx.fillRect(0, 0, w, h);
    drawBoard();
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (game.board[y][x] === "X") drawCross(x, y);
            else if (game.board[y][x] === "O") drawCircle(x, y);
        }
    }
}

const reset = () => {
    game.turn = true;
    game.over = false;
    game.x = null;
    game.y = null;
    game.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    requestAnimationFrame(update);
}

const updateScores = winner => {
    if (winner === "human") game.player++;
    else if (winner === "tie") game.ties++;
    else if (winner === "ai") game.ai++;
    playerScore.innerText = game.player;
    aiScore.innerText = game.ai;
    ties.innerText = game.ties;
}

// ####################################################
// ############ MAIN FUNCTIONS ########################
// ####################################################
const aiMove = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (game.over) return;
            if (IsBoardFull()) return;

            const availablePos = getAvailablePos();
            let [bestScore, move] = [-Infinity, undefined];

            for (let pos of availablePos) {
                // Loop over all available positions & call minimax.
                game.board[pos[1]][pos[0]] = "O";
                score = minimax(game.board, false, 4);
                game.board[pos[1]][pos[0]] = "";

                // Make decision according to results (score).
                if (score > bestScore) [bestScore, move] = [score, pos];
            }
            // Finnish the turn.
            game.turn = !game.turn;
            game.board[move[1]][move[0]] = "O";
            resolve();
        }, 0);
    })
}

const playerMove = (_x, _y) => {
    if (game.over) return;
    if (IsBoardFull()) return;

    const [x, y] = getIndexPos(_x, _y);

    if (!IsEmpty(x, y)) return;

    game.board[y][x] = "X";
    game.turn = !game.turn;
}

const update = async () => {
    const [winner, pos] = checkWin();
    if (winner) {
        // If there is a winner
        updateScores(winner);
        game.over = true;
    }
    // If ai turn.
    if (!game.turn) await aiMove();

    if (!game.over) {
        draw();
        drawHoverCross(game.x, game.y)
        requestAnimationFrame(update);
    } else draw();

    winningLine(pos);
}
requestAnimationFrame(update);

// ####################################################
// ############ EVENTS ################################
// ####################################################
restartBtn.addEventListener("click", e => reset());
canvas.addEventListener("click", e => playerMove(e.clientX, e.clientY));
canvas.addEventListener("mousemove", e => recordPos(e.clientX, e.clientY));