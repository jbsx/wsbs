import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { WebSocketServer } from "ws";
import Chess from "./game/chess";

require("dotenv").config();
const JWT_PASS = process.env.JWT_PASS
    ? process.env.JWT_PASS
    : "random characters OAOAOAoaoaoasdflkjasdfkljasdf";

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
let app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const port = 4000;

let games = new Map();

function authenticateToken(req: any, res: any, next: any) {
    const token = req.cookies.access_token;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_PASS, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

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

app.post("/login", async (req: any, res: any) => {
    const { username, password } = req.body;
    connection.query(
        `SELECT * FROM User WHERE Username='${username}'`,
        async (error: any, results: any) => {
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

                    return res
                        .cookie("access_token", token, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                        })
                        .json({
                            status: "ok",
                        });
                }
            }
        },
    );
});

app.get("/game/chess", authenticateToken, (req: any, res: any) => {
    const id = uuidv4();
    games.set(id, {
        board: new Chess(),
        players: [],
    });

    return res.json({
        status: "ok",
        id,
        message: `Game created successfully`,
    });
});

// Websocket
const wss = new WebSocketServer({ clientTracking: false, noServer: true });
const server = require("http").createServer(app);

server.on("upgrade", function (req: any, socket: any, head: any) {
    //Parse cookies
    let cookies = null;

    for (let i = 0; i < req.rawHeaders.length; i++) {
        if (req.rawHeaders[i] == "Cookie") cookies = req.rawHeaders[i + 1];
    }

    if (!cookies) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }

    let token = null;

    cookies.split("; ").forEach((i: string) => {
        const temp = i.split("=");
        if (temp[0] == "access_token") token = temp[1];
    });

    if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }

    let username: string | undefined = undefined;

    //Authenticate Token
    jwt.verify(token, JWT_PASS, (err: any, user: any) => {
        if (err) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
        username = user.username;
    });

    wss.handleUpgrade(req, socket, head, function (ws) {
        wss.emit("connection", ws, username, req);
    });
});

wss.on("connection", (ws: any, username: string | undefined, req: any) => {
    let id = req.url ? req.url.slice(1, req.url.length) : undefined;
    if (!id) return; //invalid

    let game = games.get(id);
    if (!game) return; //not live (either past game or invalid)
    if (
        !game.players.some((user: any) => {
            return user.username === username;
        }) //if not in game
    ) {
        if (game.players.length === 0)
            game.players.push({ username, team: "W", ws });
        else if (game.players.length === 1)
            game.players.push({ username, team: "B", ws });
        else {
            return; //too many players
        }
    }

    ws.send(username);

    game.players.forEach((user: any) => {
        if (user.username === username) user.ws = ws; //update connection on page reload
        let res = "players ";
        game.players.forEach((i: any) => {
            res += `${i.username},${i.team}/`;
        });
        user.ws.send(res);
    });

    ws.send(`initialRender ${game.board.print()}`);

    ws.on("message", (message: any) => {
        let mes = "";
        message.forEach((i: number) => (mes += String.fromCharCode(i)));
        const values = mes.split(" ");
        if (values[0] === "move") {
            let res = game.board.move(
                values[1],
                game.players[1].username === username ? "B" : "W",
            );
            if (res.split(" ")[0] == "moved") {
                game.players.forEach((player: any) => {
                    player.ws.send(res);
                });
            } else {
                ws.send(res);
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
