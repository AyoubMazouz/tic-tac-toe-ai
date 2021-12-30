// Size of each cell.
const s = 200;
// Padding.
const p = 40;
// Width / Height
const w = s * 3;
const h = s * 3;
// Setting the canvas height & width.
canvas.width = w;
canvas.height = h;
// Score reference for ai.
const stats = {
    "human": -10,
    "ai": 10,
    "tie": 0
};
