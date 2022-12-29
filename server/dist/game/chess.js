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
        this.board[0][0] = this.board[0][7] = new chesspiece_1.default("WHITE", "Rook");
        this.board[0][1] = this.board[0][6] = new chesspiece_1.default("WHITE", "Knight");
        this.board[0][2] = this.board[0][5] = new chesspiece_1.default("WHITE", "Bishop");
        this.board[0][3] = new chesspiece_1.default("WHITE", "Queen");
        this.board[0][4] = new chesspiece_1.default("WHITE", "King");
        this.board[1] = new Array(8).fill(new chesspiece_1.default("WHITE", "Pawn"));
        // Fill starting black pieces
        this.board[7][0] = this.board[7][7] = new chesspiece_1.default("BLACK", "Rook");
        this.board[7][1] = this.board[7][6] = new chesspiece_1.default("BLACK", "Knight");
        this.board[7][2] = this.board[7][5] = new chesspiece_1.default("BLACK", "Bishop");
        this.board[7][3] = new chesspiece_1.default("BLACK", "Queen");
        this.board[7][4] = new chesspiece_1.default("BLACK", "King");
        this.board[6] = new Array(8).fill(new chesspiece_1.default("BLACK", "Pawn"));
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
        const [x1, y1] = this.parse(coords.split("-")[0]);
        const [x2, y2] = this.parse(coords.split("-")[1]);
        console.log(x1, y1, x2, y2);
        if (!this.check(x1, y1, x2, y2)) {
            return "Try again";
        }
        this.board[x2][y2] = this.board[x1][y1];
        this.board[x1][y1] = null;
        this.turn = this.turn === "W" ? "B" : "W";
        return "Great Success";
    }
    check(x1, y1, x2, y2) {
        console.log(x1, y1, x2, y2);
        if (this.board[x1][y1] == null)
            return false;
        //@ts-ignore
        if (this.board[x1][y1].getTeam() !== this.turn)
            return false;
        // TODO
        return true;
    }
    parse(coord) {
        let res = [0, 0];
        res[0] = 1 + +coord.charAt(1);
        res[1] = coord.charCodeAt(0) - 97;
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
