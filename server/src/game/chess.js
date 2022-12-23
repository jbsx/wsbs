import Piece from './chesspiece';
export default class Chess {
    board;
    constructor() {
        // Create empty board
        this.board = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8).fill(null);
        }
        // Fill starting white pieces
        this.board[0][0] = this.board[0][7] = new Piece("WHITE", "Rook");
        this.board[0][1] = this.board[0][6] = new Piece("WHITE", "Knight");
        this.board[0][2] = this.board[0][5] = new Piece("WHITE", "Bishop");
        this.board[0][3] = new Piece("WHITE", "Queen");
        this.board[0][4] = new Piece("WHITE", "King");
        this.board[1] = new Array(8).fill(new Piece("WHITE", "Pawn"));
        // Fill starting black pieces
        this.board[7][0] = this.board[7][7] = new Piece("BLACK", "Rook");
        this.board[7][1] = this.board[7][6] = new Piece("BLACK", "Knight");
        this.board[7][2] = this.board[7][5] = new Piece("BLACK", "Bishop");
        this.board[7][3] = new Piece("BLACK", "Queen");
        this.board[7][4] = new Piece("BLACK", "King");
        this.board[6] = new Array(8).fill(new Piece("BLACK", "Pawn"));
    }
    getboard() {
        return this.board;
    }
    get(x, y) {
        return this.board[x][y];
    }
    move(x1, y1, x2, y2) {
        if (!this.check(x1, y1, x2, y2)) {
            return 'Try again';
        }
        this.board[x2][y2] = this.board[x1][y1];
        this.board[x1][y1] = null;
        return null;
    }
    check(x1, y1, x2, y2) {
        if (this.board[x1][y1] == null) {
            return false;
        }
        return true;
    }
    // Test function
    log() {
        console.log(this.board);
    }
}
//# sourceMappingURL=chess.js.map