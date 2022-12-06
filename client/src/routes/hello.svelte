<script lang='ts'>
    function run(){
        fetch("http://localhost:4000/hello", {
            method: "GET",
            credentials: 'include'
        }).then(res => {
            console.log(res);
        });
    }
</script>

<main>
    <button on:click={()=>{run()}}>LES GO</button>
    <br/>
    <br/>
    <button on:click={()=>{window.location.assign("/#/login")}}>Hello</button>
</main>
