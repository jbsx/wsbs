<script lang="ts">
    import Chess from "../game/chess";

    let chess = new Chess();

    $: renderBuffer = {};
    $: board = chess.getboard();

    $: render = (x: number, y: number) => {
        let piece = board[x][y];
        if (!piece){
            return "";
        }
        return `../${piece.getTeam()}_${piece.getType()}.svg`;
    }

    $: selected = null;

    $: err = null;
    $: move = (x: number, y: number) => {
        if (!selected){
            renderBuffer[`${x}-${y}`].classList.add("selected");
            selected = [x, y];
            return;
        }
        err = chess.move(selected[0], selected[1], x, y);

        renderBuffer[`${selected[0]}-${selected[1]}`].classList.remove("selected");

        selected = null
        board = chess.getboard();
    }
</script>

<main>
    <div id="chessboard">
        {#each Array(8) as _, i}
            <div class="chesspad row row-{i}">
                {#each Array(8) as _, j}
                    {#if (i+j)%2 == 0}
                        <div class="chesspad white" id="{7-i}-{7-j}" on:click={()=>{move(7-i, 7-j)}} bind:this={renderBuffer[`${7-i}-${7-j}`]}><img alt="" src={render(7-i, 7-j)}/></div>
                    {:else}
                        <div class="chesspad black" id="{7-i}-{7-j}" on:click={()=>{move(7-i, 7-j)}} bind:this={renderBuffer[`${7-i}-${7-j}`]}><img alt="" src={render(7-i, 7-j)}/></div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
    <span>{err}</span>
</main>

<style>
    #chessboard{
        margin: 0%;
        padding: 0%;
    }
    .chesspad{
        height: 80px;
        min-width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .black{
        background-color: peru;
    }
    .white{
        background-color: tan;
    }
    .row{
        display: flex;
    }
    .selected{
        background-color: olive;
    }
</style>
