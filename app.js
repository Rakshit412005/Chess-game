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

io.on("connection",function(uniquesocket){
    console.log("connected");
    uniquesocket.on("hello",function(){
        console.log("hello recieved");
    });
    
    if(!players.white){ //Agar white player nahi hai
        players.white=uniquesocket.id; // To banado
        uniquesocket.emit("playerRole","w");
    }
    else if(!players.black){ // Agar black player nahi hai
        players.black=uniquesocket.id; // To banado
        uniquesocket.emit("playerRole","b");
    }
    else{ // Agar black and white dono hai 
        uniquesocket.emit("spectatorRole"); // To spectator banado
    }

    uniquesocket.on("disconnect",function(){
        if(uniquesocket.id===players.white){
            delete players.white;
        }
        else if(uniquesocket.id===players.black){
            delete players.black;
        }
    })
    
    uniquesocket.on("move",(move)=>{
        try{
            if(chess.turn()==='w' && uniquesocket.id !== player.white) return; // checking white ka turn hai to white hee chal rha hai na
            if(chess.turn()==='b' && uniquesocket.id !== players.black) return; // checking black ka turn hai to black hee chal rha hai na

            const result = chess.move(move); // move ko result m store krliya
            if(result){ // agar move valid hai 
                currentPlayer = chess.turn();
                io.emit("move",move); // frontend par move bhej diya
                io.emit("boardState", chess.fen())
            }
            else {
                console.log("Invalid move : ", move);
                uniquesocket.emit("invalidMove",move);
            }
        }
       catch(err){
        console.log(err);
        uniquesocket.emit("Invalid move : ", move);
       } 
    })
});

server.listen(3000,function(){
    console.log("listening on port 3000");
});