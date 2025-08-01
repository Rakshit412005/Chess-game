const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js")
const path = require("path");
const { title } = require("process");

const app = express();
const server =  http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index", {title: "Chess game"});
});

io.on("connection",function(socket){
    console.log("connected");
    socket.on("hello",function(){
        console.log("hello recieved");
    });
});

server.listen(3000,function(){
    console.log("listening on port 3000");
});