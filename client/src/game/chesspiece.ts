enum Types {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
}
;

const pieceval = {
  Pawn : 1,
  Knight : 3,
  Bishop : 3,
  Rook : 5,
  Queen : 9,
  King : Infinity,
}

type Team = "WHITE" | "BLACK";
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
    if (this.piecetype !== "Pawn" || piecetype === "King") {
      return
    }

    this.piecetype = piecetype;
    this.value = pieceval[piecetype];
  }

  getType(): string { return this.piecetype; }

  getTeam(): string { return this.team; }

  getValue(): number { return this.value; }

  // test function
  log(): void { console.log(this.team, this.piecetype, this.value); }
}
