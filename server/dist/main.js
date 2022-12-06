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
const ws_1 = __importDefault(require("ws"));
const JWT_PASS = "ASL;DFJAONO01)!(J#)*FJOAQFSJAOLIFJ)(Q!J@OIJ!#";
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
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 4000;
// Websocket
const wsserver = new ws_1.default.WebSocketServer({
    server: require("http").createServer(app),
}, () => {
    console.log("client connected");
});
wsserver.on("message", (message) => {
    console.log(message);
});
// Middlewares
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, JWT_PASS, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
// Register
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
// Login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    connection.query(`SELECT * FROM User WHERE Username='${username}'`, (error, results, fields) => __awaiter(void 0, void 0, void 0, function* () {
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
                return (res
                    //.cookie("token", token, {
                    //    expires: new Date(Date.now() + 9999999),
                    //    httpOnly: false,
                    //})
                    .json({
                    status: "ok",
                    data: token,
                }));
            }
        }
    }));
}));
app.post("/game/chess", authenticateToken, (req, res) => {
    return res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
