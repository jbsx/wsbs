const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_PASS = "ASL;DFJAONO01)!(J#)*FJOAQFSJAOLIFJ)(Q!J@OIJ!#";

//Database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test123",
    database: "wsbsdb",
});

connection.connect();
//connection.end();

//Server
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

app.post("/register", async (req: any, res: any) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.json({ status: "error", error: "Invalid Username or Password" });
    }

    // TODO username and password edge cases

    connection.query(
        `INSERT INTO User (Username, Password) VALUES ("${username}", "${await bcrypt.hash(
            password,
            10,
        )}")`,
        (error: any, results: any, fields: any) => {
            if (error) {
                console.log(JSON.stringify(error));

                if (error["code"] === "ER_DUP_ENTRY") {
                    res.json({
                        status: "error",
                        error: "Username already in use",
                    });
                } else {
                    throw error;
                }
            } else {
                res.json({ status: "ok" });
            }
        },
    );
});

app.post("/login", async (req: any, res: any) => {
    const { username, password } = req.body;
    connection.query(
        `SELECT * FROM User WHERE Username='${username}'`,
        async (error: any, results: any, fields: any) => {
            if (error) {
                console.log(error);
                throw error;
            }

            if (results.length !== 1) {
                return res.json({
                    status: "error",
                    message: "Invalid Username or Password",
                });
            }

            if (results[0]) {
                const resUser = results[0]["Username"];
                const resPass = results[0]["Password"];

                const valid_password = await bcrypt.compare(password, resPass);

                if (!valid_password) {
                    return res.json({
                        status: "error",
                        message: "Invalid Username or Password",
                    });
                } else {
                    const token = jwt.sign(
                        {
                            userid: results[0]["UserId"],
                            username: resUser,
                        },
                        JWT_PASS,
                    );

                    return res.json({
                        status: "ok",
                        data: token,
                    });
                }
            }
        },
    );
});

app.post("logout", (req: any, res: any) => {});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
