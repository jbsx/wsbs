"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const uuid_1 = require("uuid");
const ws_1 = require("ws");
const chess_1 = __importDefault(require("./game/chess"));
require("dotenv").config();
const JWT_PASS = process.env.JWT_PASS
    ? process.env.JWT_PASS
    : "random characters OAOAOAoaoaoasdflkjasdfkljasdf";
// Database
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "test123",
    database: "wsbsdb",
});
connection.connect();
// connection.end();
// Server
let app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const port = 4000;
let games = new Map();
function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, JWT_PASS, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            status: "error",
            error: "Invalid Username or Password",
        });
    }
    // TODO username and password edge cases
    connection.query(`INSERT INTO User (Username, Password) VALUES ("${username}", "${yield bcryptjs_1.default.hash(password, 10)}")`, (error, results, fields) => {
        if (error) {
            console.log(JSON.stringify(error));
            if (error["code"] === "ER_DUP_ENTRY") {
                return res.status(401).json({
                    status: "401",
                    message: "Username already in use",
                });
            }
            else {
                throw error;
            }
        }
        else {
            return res.status(200).json({ message: "Successful" });
        }
    });
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    connection.query(`SELECT * FROM User WHERE Username='${username}'`, (error, results) => __awaiter(void 0, void 0, void 0, function* () {
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
            const valid_password = yield bcryptjs_1.default.compare(password, resPass);
            if (!valid_password) {
                return res
                    .status(401)
                    .json({ message: "Incorrect password" });
            }
            else {
                const token = jsonwebtoken_1.default.sign({
                    userid: results[0]["UserId"],
                    username: resUser,
                }, JWT_PASS);
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
    }));
}));
app.get("/game/chess", authenticateToken, (req, res) => {
    const id = (0, uuid_1.v4)();
    games.set(id, {
        board: new chess_1.default(),
        players: [],
    });
    return res.json({
        status: "ok",
        id,
        message: `Game created successfully`,
    });
});
// Websocket
const wss = new ws_1.WebSocketServer({ clientTracking: false, noServer: true });
const server = require("http").createServer(app);
server.on("upgrade", function (req, socket, head) {
    //Parse cookies
    let cookies = null;
    for (let i = 0; i < req.rawHeaders.length; i++) {
        if (req.rawHeaders[i] == "Cookie")
            cookies = req.rawHeaders[i + 1];
    }
    if (!cookies) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
    let token = null;
    cookies.split("; ").forEach((i) => {
        const temp = i.split("=");
        if (temp[0] == "access_token")
            token = temp[1];
    });
    if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
    let username = undefined;
    //Authenticate Token
    jsonwebtoken_1.default.verify(token, JWT_PASS, (err, user) => {
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
wss.on("connection", (ws, username, req) => {
    let id = req.url ? req.url.slice(1, req.url.length) : undefined;
    if (!id)
        return; //invalid
    let game = games.get(id);
    if (!game)
        return; //not live (either past game or invalid)
    if (!game.players.some((user) => {
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
    game.players.forEach((user) => {
        if (user.username === username)
            user.ws = ws; //update connection on page reload
        let res = "players ";
        game.players.forEach((i) => {
            res += `${i.username},${i.team}/`;
        });
        user.ws.send(res);
    });
    ws.send(`initialRender ${game.board.print()}`);
    ws.on("message", (message) => {
        let mes = "";
        message.forEach((i) => (mes += String.fromCharCode(i)));
        const values = mes.split(" ");
        if (values[0] === "move") {
            let res = game.board.move(values[1], game.players[1].username === username ? "B" : "W");
            if (res.split(" ")[0] == "moved") {
                game.players.forEach((player) => {
                    player.ws.send(res);
                });
            }
            else {
                ws.send(res);
            }
        }
    });
});
server.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
