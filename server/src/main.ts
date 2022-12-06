import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import ws from "ws";

const JWT_PASS = "ASL;DFJAONO01)!(J#)*FJOAQFSJAOLIFJ)(Q!J@OIJ!#";

// Database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test123",
    database: "wsbsdb",
});

connection.connect();
// connection.end();

// Server
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
const port = 4000;

// Websocket
const wsserver = new ws.WebSocketServer(
    {
        server: require("http").createServer(app),
    },
    () => {
        console.log("client connected");
    },
);

wsserver.on("message", (message) => {
    console.log(message);
});

// Middlewares
function authenticateToken(req: any, res: any, next: any) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_PASS, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Register
app.post("/register", async (req: any, res: any) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            status: "error",
            error: "Invalid Username or Password",
        });
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
                    return res.status(401).json({
                        status: "401",
                        message: "Username already in use",
                    });
                } else {
                    throw error;
                }
            } else {
                return res.status(200).json({ message: "Successful" });
            }
        },
    );
});

// Login
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
                return res.status(403).json({
                    status: "error",
                    message: "Invalid Username or Password",
                });
            }

            if (results[0]) {
                const resUser = results[0]["Username"];
                const resPass = results[0]["Password"];

                const valid_password = await bcrypt.compare(password, resPass);

                if (!valid_password) {
                    return res
                        .status(401)
                        .json({ message: "Incorrect password" });
                } else {
                    const token = jwt.sign(
                        {
                            userid: results[0]["UserId"],
                            username: resUser,
                        },
                        JWT_PASS,
                    );

                    return (
                        res
                            //.cookie("token", token, {
                            //    expires: new Date(Date.now() + 9999999),
                            //    httpOnly: false,
                            //})
                            .json({
                                status: "ok",
                                data: token,
                            })
                    );
                }
            }
        },
    );
});

app.post("/game/chess", authenticateToken, (req: any, res: any) => {
    return res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
