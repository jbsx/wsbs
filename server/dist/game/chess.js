"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chesspiece_1 = __importDefault(require("./chesspiece"));
class Chess {
    constructor() {
        this.turn = "W";
        // Create empty board
        this.board = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8).fill(null);
        }
        // Fill starting white pieces
        this.board[0][0] = new chesspiece_1.default("W", "R");
        this.board[0][1] = new chesspiece_1.default("W", "N");
        this.board[0][2] = new chesspiece_1.default("W", "B");
        this.board[0][3] = new chesspiece_1.default("W", "Q");
        this.board[0][4] = new chesspiece_1.default("W", "K");
        this.board[0][5] = new chesspiece_1.default("W", "B");
        this.board[0][6] = new chesspiece_1.default("W", "N");
        this.board[0][7] = new chesspiece_1.default("W", "R");
        this.board[1] = new Array(8).fill(new chesspiece_1.default("W", "P"));
        // Fill starting black pieces
        this.board[7][0] = new chesspiece_1.default("B", "R");
        this.board[7][1] = new chesspiece_1.default("B", "N");
        this.board[7][2] = new chesspiece_1.default("B", "B");
        this.board[7][3] = new chesspiece_1.default("B", "Q");
        this.board[7][4] = new chesspiece_1.default("B", "K");
        this.board[7][5] = new chesspiece_1.default("B", "B");
        this.board[7][6] = new chesspiece_1.default("B", "N");
        this.board[7][7] = new chesspiece_1.default("B", "R");
        this.board[6] = new Array(8).fill(new chesspiece_1.default("B", "P"));
    }
    getboard() {
        return this.board;
    }
    get(x, y) {
        return this.board[x][y];
    }
    move(coords, by) {
        if (this.turn !== by)
            return "Waiting for the opponent to play their turn";
        const [row_f, column_f] = this.parse(coords.split("-")[0]);
        const [row_t, column_t] = this.parse(coords.split("-")[1]);
        console.log(`move from ${column_f},${row_f} to ${column_t},${row_t}`);
        if (!this.check(row_f, column_f, row_t, column_t)) {
            return `Failed`;
        }
        this.board[row_t][column_t] = this.board[row_f][column_f];
        this.board[row_f][column_f] = null;
        this.turn = this.turn === "W" ? "B" : "W";
        return `moved ${coords}`;
    }
    check(row_f, column_f, row_t, column_t) {
        if (this.board[row_f][column_f] == null)
            return false;
        //@ts-ignore
        if (this.board[row_f][column_f].getTeam() !== this.turn)
            return false;
        // TODO
        return true;
    }
    parse(coord) {
        let res = [0, 0];
        res[0] = +coord.charAt(1) - 1;
        res[1] = coord.charCodeAt(0) - 97;
        res.forEach((i) => {
            if (i < 0 || i > 7) {
                console.log(res);
                throw new Error("invalid coordinates");
            }
        });
        console.log(coord, res);
        return res;
    }
    print() {
        let res = "";
        this.board.forEach((row) => {
            row.forEach((cell) => {
                if (cell)
                    res += cell === null || cell === void 0 ? void 0 : cell.print();
                res += ",";
            });
        });
        return res.substring(0, res.length - 1);
    }
    // Test function
    log() {
        console.log(this.board);
    }
}
exports.default = Chess;
