<script lang='ts'>
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
          }).then( res => {
            console.log(res.json);
          });
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
</main>
