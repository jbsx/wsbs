<script lang="ts">
    import Chess from "../game/chess.js";

    let chess = new Chess();
    chess.log();

    function render(x: number, y: number){
        let piece = chess.get(x,y);
        if (!piece){
            return "";
        }
        return `../../public/${piece.getTeam()}_${piece.getType()}.svg`;
    }

    function run(){
        chess.move(1, 5, 2, 5);
        chess.log();
    }
</script>

<main>
    <button on:click={()=>{run()}}>run</button>
    <div id="chessboard">
        {#each Array(8) as _, i}
            <div class="chesspad row row-{i}">
                {#each Array(8) as _, j}
                    {#if (i+j)%2 == 0}
                        <div class="chesspad white column column-{j}" id="{i}-{j}"><img alt="" src={render(i, j)}/></div>
                    {:else}
                        <div class="chesspad black column column-{j}" id="{i}-{j}"><img alt="" src={render(i, j)}/></div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</main>

<style>
    *{
        margin: 0%;
        padding: 0%;
    }
    #chessboard{
        height: 660px;
        width: 660px;
        padding-left: 20px;
        padding-bottom: 20px;
        background-color: green;
    }
    .chesspad{
        height: 80px;
        min-width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .black{
        background-color: goldenrod;
    }
    .white{
        background-color: whitesmoke;
    }
    .row{
        display: flex;
    }
</style>
