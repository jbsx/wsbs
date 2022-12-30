enum Types {
    P, //PAWN
    N, //KNIGHT
    B, //BISHOP
    R, //ROOK
    Q, //QUEEN
    K, //KING
}
const pieceval = {
    P: 1,
    N: 3,
    B: 3,
    R: 5,
    Q: 9,
    K: Infinity,
};

type Team = "W" | "B";
type Type = keyof typeof Types;

export default class Piece {
    private team: Team;
    private piecetype: Type;
    private value: number;

    constructor(team: Team, piecetype: Type) {
        this.team = team;
        this.piecetype = piecetype;
        this.value = pieceval[this.piecetype];
    }

    upgrade(piecetype: Type): void {
        if (this.piecetype !== "P" || piecetype === "P" || piecetype === "K") {
            return;
        }

        this.piecetype = piecetype;
        this.value = pieceval[piecetype];
    }

    getType(): string {
        return this.piecetype;
    }

    getTeam(): string {
        return this.team;
    }

    getValue(): number {
        return this.value;
    }

    print(): string {
        return this.team + this.piecetype;
    }
    // test function
    log(): void {
        console.log(this.team, this.piecetype, this.value);
    }
}
