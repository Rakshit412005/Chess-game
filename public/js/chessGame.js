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
            if (square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText=""
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
     
}
const handleMove = () => {

}
const getPieceUnicode = () => {

}
renderBoard();