import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import Chess from "./game/chess";

require("dotenv").config();
const JWT_PASS = process.env.JWT_PASS
    ? process.env.JWT_PASS
    : "8=============D";

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
let { app } = expressWs(express());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = 4000;

// Websocket
let connections = new Map();
let games = new Map();

app.ws("/cum", authenticateToken, (ws, res) => {
    console.log("from connection");
    ws.send("Connected to server");
    ws.on("message", function message(data) {
        console.log(data);
        ws.send("pinging back from ws server");
    });
});

function authenticateToken(req: any, res: any, next: any) {
    const token = req.cookies.access_token;
    console.log(token);

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
    games.set(id, [new Chess(), []]);

    return res.json({
        status: "ok",
        id,
        message: `Game created successfully`,
    });
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
