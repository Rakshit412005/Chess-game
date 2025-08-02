const socket=io();
socket.emit("hello");
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null; 
let playerRole = null;

const renderBoard = () => {
     const board = chess.board();
     boardElement.innerHTML="";
     board.forEach((row,rowindex)=>{
        row.forEach((square,squareindex)=>{
            console.log(square);
            const squareElement = document.createElement("div"); // boxes ke design and color ke liye logic
            squareElement.classList.add(
                "square",
                (rowindex + squareindex)% 2 === 0 ? "light" : "dark"
            )
            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;
            if (square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText=getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;
                pieceElement.addEventListener("dragstart",()=>{
                    if(pieceElement.draggable){
                        draggedPiece=pieceElement;
                        sourceSquare = {row: rowindex, col: squareindex};
                        e.dataTranfer.setData("text/plain","");
                    }

                })
                pieceElement.addEventListener("dragend",(e)=>{
                    draggedPiece = null;
                    sourceSquare= null;
                })
                squareElement.appendChild(pieceElement);
            }
            squareElement.addEventListener("dragover",function (e){
                e.preventDefault();
            })
            squareElement.addEventListener("drop",function(e){
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row:parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    }
                    handleMove(sourceSquare,targetSource);
                }
            })
            boardElement.appendChild(squareElement);
        })
     })
     if(playerRole==='b'){
        boardElement.classList.add("flipped");

     }
     else{
        boardElement.classList.remove('flipped');
     }
     
}
const handleMove = (source, target) => {
    console.log("Received move:", { source, target });

    if (
        !source || typeof source.col !== 'number' || typeof source.row !== 'number' ||
        !target || typeof target.col !== 'number' || typeof target.row !== 'number'
    ) {
        console.error("Invalid move coordinates!", { source, target });
        return;
    }

    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    console.log("Sending move:", move);
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const pieceUnicode = {
        p: "♙", // black pawn
        r: "♜", // black rook
        n: "♞", // black knight
        b: "♝", // black bishop
        q: "♛", // black queen
        k: "♚", // black king
        P: "♙", // white pawn
        R: "♖", // white rook
        N: "♘", // white knight
        B: "♗", // white bishop
        Q: "♕", // white queen
        K: "♔", // white king
    };
    return pieceUnicode[piece.type] || "";


}
socket.on("playerRole",function(role){
    playerRole=role;
    renderBoard();
})
socket.on("spectatorRole",function (){
    playerRole = null;
    renderBoard();
})
socket.on("boardState",function(fen){
    chess.load(fen);
    renderBoard();
})
socket.on("move",function(move){
    chess.move(move);
    renderBoard();
})
renderBoard();