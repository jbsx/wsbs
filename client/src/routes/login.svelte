<script lang='ts'>
    async function loginUser(e: any) {
        e.preventDefault();
        const username = document.getElementById("username")["value"];
        const password = document.getElementById("password")["value"];

        let res = await fetch( "http://localhost:4000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        });
        if (res.status === 200) window.location.assign("/#/")
    }
</script>

<main>
    Login
    <form id="login-form" on:submit={(e)=>{loginUser(e)}}>
        <br/>
        <input type="text" id="username" placeholder="Username"/>
        <br/>
        <input type="password" id="password" placeholder="Password"/>
        <br/>
        <br/>
        <input type="submit" value="Login"/>
    </form>
</main>
