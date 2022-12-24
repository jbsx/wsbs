<script lang="ts">
    const id = window.location.hash.split('/')[window.location.hash.split('/').length-1]

    let socket = null;

    // Create WebSocket connection.
    socket = new WebSocket('ws://localhost:4000/cum'); // send jwt token cookie on websocket handshake???

    socket.onopen = (bruh)=>{
        console.log(bruh)
        socket.send('Hello Server!');
    }
    console.log(socket)
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
    <button on:click={()=>{run()}}>Send message to server</button>
</main>

<style>
</style>
