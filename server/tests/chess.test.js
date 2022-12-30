import Chess from "../src/game/chess";
import { describe, it, expect } from "vitest";

describe("#chess", () => {
    let board = new Chess();
    it("board print", () => {
        expect(board.print()).toEqual(
            "WR,WN,WB,WQ,WK,WB,WN,WR,WP,WP,WP,WP,WP,WP,WP,WP,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BP,BP,BP,BP,BP,BP,BP,BP,BR,BN,BB,BQ,BK,BB,BN,BR",
        );
    });

    it("chessboard parse", () => {
        expect(board.parse("a8")).toEqual([7, 0]);
        expect(board.parse("h1")).toEqual([0, 7]);
    });
});
