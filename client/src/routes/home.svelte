<script lang='ts'>

</script>

<main>
    <nav>
        <div class="left">
            Bootleg Chess.com
        </div>
        <div class="right">
            <button on:click={()=>{window.location.href = "/#/register"}}>Register</button>
            <button on:click={()=>{window.location.href = "/#/login"}}>Login</button>
        </div>
    </nav>
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
