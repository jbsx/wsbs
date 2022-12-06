<script lang='ts'>
    $: err = '';
    async function registerUser(e: any) {
        e.preventDefault();
        const username = document.getElementById("username")["value"];
        const password = document.getElementById("password")["value"];

        const res = await fetch( "http://localhost:4000/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        if (res.ok){
            await fetch( "http://localhost:4000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            window.location.assign('/#/');
        } else {
            err = "Something went wrong";
        }
    }
</script>

<main>
    Register
    <form id="reg-form" on:submit={(e)=>{registerUser(e)}}>
        <br/>
        <input type="text" id="username" placeholder="Username"/>
        <br/>
        <input type="password" id="password" placeholder="Password"/>
        <br/>
        <br/>
        <input type="submit" value="Register"/>
    </form>
    <span>{err}</span>
</main>
