<script lang='ts'>
    let temp = "";
</script>

<main>
    <nav>
        <div class="left">
            Bad chess.com clone
        </div>
        <div class="right">
            <button on:click={()=>{window.location.href = "/#/register"}}>Register</button>
            <button on:click={()=>{window.location.href = "/#/login"}}>Login</button>
        </div>
    </nav>
    <div class="game-buttons">
        <input type="text" bind:value={temp}/>
        <button on:click={async ()=>{
            window.location.assign(`/#/game/${temp}`)
        }}>Join game</button>
        <br/>
        <br/>
        <button on:click={async ()=>{
            fetch("http://localhost:4000/game/chess", {credentials: "include"}).then( async res =>{
                let body = await res.json()
                if (body.id){
                    window.location.assign(`/#/game/${body.id}`)
                }
            })
        }}>Create game</button>
    </div>
</main>

<style>
    nav{
        display: flex;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100vw;
        justify-content: space-between;
        padding: 10px;
    }
</style>
