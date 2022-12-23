<script lang='ts'>
    let socket = null;

    // Create WebSocket connection.
    socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', (event) => {
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
    });

    function run(){
        if (!socket) {
            console.log('no websocket connection')
            return
        }
        socket.send('asdf')
    }
</script>

<main>
    <button on:click={()=>{run()}}>send it</button>
</main>
