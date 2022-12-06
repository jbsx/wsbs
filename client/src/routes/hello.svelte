<script lang='ts'>
    function run(){
        // Create WebSocket connection.
        const socket = new WebSocket('ws://localhost:4000');

        // Connection opened
        socket.addEventListener('open', (event) => {
            socket.send('Hello Server!');
        });

        // Listen for messages
        socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });

    }
</script>

<main>
    <button on:click={()=>{run()}}>send it</button>
</main>
