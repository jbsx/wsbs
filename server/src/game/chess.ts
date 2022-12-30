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
        this.board[0][0] = new Piece("W", "R");
        this.board[0][1] = new Piece("W", "N");
        this.board[0][2] = new Piece("W", "B");
        this.board[0][3] = new Piece("W", "Q");
        this.board[0][4] = new Piece("W", "K");
        this.board[0][5] = new Piece("W", "B");
        this.board[0][6] = new Piece("W", "N");
        this.board[0][7] = new Piece("W", "R");
        this.board[1] = new Array(8).fill(new Piece("W", "P"));

        // Fill starting black pieces
        this.board[7][0] = new Piece("B", "R");
        this.board[7][1] = new Piece("B", "N");
        this.board[7][2] = new Piece("B", "B");
        this.board[7][3] = new Piece("B", "Q");
        this.board[7][4] = new Piece("B", "K");
        this.board[7][5] = new Piece("B", "B");
        this.board[7][6] = new Piece("B", "N");
        this.board[7][7] = new Piece("B", "R");
        this.board[6] = new Array(8).fill(new Piece("B", "P"));
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

    check(
        row_f: number,
        column_f: number,
        row_t: number,
        column_t: number,
    ): boolean {
        if (this.board[row_f][column_f] == null) return false;
        //@ts-ignore
        if (this.board[row_f][column_f].getTeam() !== this.turn) return false;

        // TODO

        return true;
    }

    parse(coord: string): [number, number] {
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
