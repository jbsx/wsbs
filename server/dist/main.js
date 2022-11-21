"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 4000;
//@ts-ignore
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//@ts-ignore
app.get("/game/:id", (req, res) => {
    console.log(req.params.id);
    res.send("running");
});
//@ts-ignore
app.get("/register", (req, res) => {
    //TODO
    //console.log(req.body);
    console.log("ALKFJLASDJF");
    res.send("running");
});
//@ts-ignore
app.get("login", (req, res) => {
    //TODO
    console.log(req.params.id);
    res.send("running");
});
//@ts-ignore
app.get("logout", (req, res) => {
    //TODO
    console.log(req.params.id);
    res.send("running");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
