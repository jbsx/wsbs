import Piece from "./chesspiece";

export default class Chess {
    private board: Array<Array<Piece | null>>;
    private turn: string = "W";

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

    getboard(): Array<Array<Piece | null>> {
        return this.board;
    }

    get(x: number, y: number): Piece | null {
        return this.board[x][y];
    }

    move(coords: string, by: string): string {
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

    check(x1: number, y1: number, x2: number, y2: number): boolean {
        console.log(x1, y1, x2, y2);
        if (this.board[x1][y1] == null) return false;
        //@ts-ignore
        if (this.board[x1][y1].getTeam() !== this.turn) return false;

        // TODO

        return true;
    }

    parse(coord: string): [number, number] {
        let res = [0, 0];
        res[0] = 1 + +coord.charAt(1);
        res[1] = coord.charCodeAt(0) - 97;
        return res as [number, number];
    }

    print(): string {
        let res = "";
        this.board.forEach((row) => {
            row.forEach((cell) => {
                if (cell) res += cell?.print();
                res += ",";
            });
        });
        return res.substring(0, res.length - 1);
    }

    // Test function
    log(): void {
        console.log(this.board);
    }
}
