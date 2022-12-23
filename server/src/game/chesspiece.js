var Types;
(function (Types) {
    Types[Types["Pawn"] = 0] = "Pawn";
    Types[Types["Knight"] = 1] = "Knight";
    Types[Types["Bishop"] = 2] = "Bishop";
    Types[Types["Rook"] = 3] = "Rook";
    Types[Types["Queen"] = 4] = "Queen";
    Types[Types["King"] = 5] = "King";
})(Types || (Types = {}));
;
const pieceval = {
    Pawn: 1,
    Knight: 3,
    Bishop: 3,
    Rook: 5,
    Queen: 9,
    King: Infinity,
};
export default class Piece {
    team;
    piecetype;
    value;
    constructor(team, piecetype) {
        this.team = team;
        this.piecetype = piecetype;
        this.value = pieceval[this.piecetype];
    }
    upgrade(piecetype) {
        if (this.piecetype !== "Pawn" || piecetype === "King") {
            return;
        }
        this.piecetype = piecetype;
        this.value = pieceval[piecetype];
    }
    getType() { return this.piecetype; }
    getTeam() { return this.team; }
    getValue() { return this.value; }
    // test function
    log() { console.log(this.team, this.piecetype, this.value); }
}
//# sourceMappingURL=chesspiece.js.map