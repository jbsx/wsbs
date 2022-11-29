<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/home.svelte";
    import Register from "./routes/register.svelte";
    import Login from "./routes/login.svelte";
    import Game from "./routes/game.svelte";

    let routes = {
        "/": Home,
        "/register": Register,
        "/login": Login,
        "/game/:id": Game
    }
</script>

<main>
    <Router {routes}/>
</main>

<style>
</style>
