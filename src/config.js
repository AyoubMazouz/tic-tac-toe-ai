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
// Colors.
const colors = {
    board: "rgba(0, 0, 0, .1)",
    X: "rgb(16, 185, 129)",
    XHover: "rgba(16, 185, 129, .1)",
    O: "#e11d48",
    line: "#0ea5e9",
    bg: "#ffff",
}
// Score reference for ai.
const stats = {
    "human": -10,
    "ai": 10,
    "tie": 0
};
