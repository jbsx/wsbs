<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/home.svelte";
    import Register from "./routes/register.svelte";
    import Login from "./routes/login.svelte";
    import Chess from "./routes/chess.svelte";

    let routes = {
        "/": Home,
        "/register": Register,
        "/login": Login,
        "/game/:id": Chess
    }
</script>

<main>
    <Router {routes}/>
</main>

<style>
</style>
