<script lang="ts">
    export let params: any;
    const id = params.id;

    let socket = new WebSocket(`ws://localhost:4000/${id}`);
    let user:{[k:string]: any} = {};
    let players = [];
    let waiting = null;
    let render = {}
    let chessboard = null;

    socket.addEventListener("message", (message: any)=>{
        const data = message.data.split(' ');

        if (data.length === 1){
            user.username = data[0]; //set user
        } else if (data[0] === 'players'){
            const users = data[1].split('/')
            users.pop();
            users.forEach((u:any)=>{
                const values = u.split(',')
                if (values[0] === user.username) {
                    user.team = values[1]
                }
            })
            players = users
            if (players.length === 2) {
                waiting.style = "visibility: hidden"
                chessboard.style = "visibility: visible"
            }
            
        } else if (data[0] === 'initialRender'){
            data[1].split(",").forEach((i: any, idx: any)=>{
                if (!i) return
                idx++
                const column = String.fromCharCode(97 + (idx-1)%8);
                const row = Math.ceil(idx/8);
                render[esrap(`${column}${row}`)].style = `background-image: url(\"${i}.svg\")`
            });
        } else if(data[0] === "moved"){
            data.slice(1, data.length).forEach((coords: string)=>{
                const values = coords.split('-')
                render[esrap(values[1])].style.backgroundImage = render[esrap(values[0])].style.backgroundImage
                render[esrap(values[0])].style = "";
            })
        } else {
            console.log(data)
        }
    });

    let selected = undefined;

    function parse(input: string){ 
        if ( user.team === "W" ){
            return String.fromCharCode(+input.charAt(1) + 97) + (8-(+input.charAt(0))) 
        }else if( user.team === "B" ){
            return String.fromCharCode(104-(+input.charAt(1))) + ((+input.charAt(0)) + 1)
        }
    }

    function esrap(input: string){
        if ( user.team === "W" ){
            return  (8 - (+input.charAt(1))).toString() + ((+input.charCodeAt(0) - 97)).toString()
        } else if( user.team === "B" ){
            return ((+input.charAt(1)) - 1).toString() + (104-(+input.charCodeAt(0))).toString()
        }
    }

    function move(to: string){
        if (!selected) return;
        if (selected === to) return;
        socket.send(`move ${selected}-${to} ${user.username}`)
    }

</script>

<main>
    <span>{id}</span><br/><br/>
    <span bind:this={waiting}>Waiting for players</span>
    <div bind:this={chessboard} id="chessboard">
        {#each Array(8) as _, i}
            <div class="chesspad">
                {#each Array(8) as _, j}
                    {#if (i+j)%2 == 0}
                        <div class="chesspad white" id="{`${i}${j}`}" bind:this={render[`${i}${j}`]} on:mousedown={()=>{selected = parse(`${i}${j}`)}} on:mouseup={()=>{move(parse(`${i}${j}`))}}></div>
                    {:else}
                        <div class="chesspad black" id="{`${i}${j}`}" bind:this={render[`${i}${j}`]} on:mousedown={()=>{selected = parse(`${i}${j}`)}} on:mouseup={()=>{move(parse(`${i}${j}`))}}></div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</main>

<style>
    #chessboard{
        user-select: none;
        margin: 0%;
        padding: 0%;
        visibility: hidden;
    }
    .chesspad{
        height: 80px;
        min-width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        /*background-image: url('BLACK_King.svg');*/
        background-size: 100%;
    }
    .black{
        background-color: steelblue;
    }
    .white{
        background-color: lightsteelblue;
    }
</style>
