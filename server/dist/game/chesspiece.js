"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types;
(function (Types) {
    Types[Types["P"] = 0] = "P";
    Types[Types["N"] = 1] = "N";
    Types[Types["B"] = 2] = "B";
    Types[Types["R"] = 3] = "R";
    Types[Types["Q"] = 4] = "Q";
    Types[Types["K"] = 5] = "K";
})(Types || (Types = {}));
const pieceval = {
    P: 1,
    N: 3,
    B: 3,
    R: 5,
    Q: 9,
    K: Infinity,
};
class Piece {
    constructor(team, piecetype) {
        this.team = team;
        this.piecetype = piecetype;
        this.value = pieceval[this.piecetype];
    }
    upgrade(piecetype) {
        if (this.piecetype !== "P" || piecetype === "P" || piecetype === "K") {
            return;
        }
        this.piecetype = piecetype;
        this.value = pieceval[piecetype];
    }
    getType() {
        return this.piecetype;
    }
    getTeam() {
        return this.team;
    }
    getValue() {
        return this.value;
    }
    print() {
        return this.team + this.piecetype;
    }
    // test function
    log() {
        console.log(this.team, this.piecetype, this.value);
    }
}
exports.default = Piece;
