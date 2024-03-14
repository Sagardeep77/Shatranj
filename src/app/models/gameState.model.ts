import { ArrayType } from '@angular/compiler';
// import WhiteRook from 'src\assets\chess-pieces\black\tabler--chess-rook.svg';
// import BlackRook from './../../assets/svgs/white/rook-filled.svg';
// import BlackRookImg from './../../assets/images/white/rook.png';

const ChessIconImgPath = {
    "WhiteRook" : './../../assets/images/white/rook.png',
    "WhiteKnight" : './../../assets/images/white/knight.png',
    "WhiteBishop" : './../../assets/images/white/bishop.png',
    "WhiteKing" : './../../assets/images/white/king.png',
    "WhiteQueen" : './../../assets/images/white/queen.png',
    "WhitePawn" : './../../assets/images/white/pawn.png',
    "BlackRook" : './../../assets/images/black/rook.png',
    "BlackKnight" : './../../assets/images/black/knight.png',
    "BlackBishop" : './../../assets/images/black/bishop.png',
    "BlackKing" : './../../assets/images/black/king.png',
    "BlackQueen" : './../../assets/images/black/queen.png',
    "BlackPawn" : './../../assets/images/black/pawn.png',
}

// import WhiteRook from './../chess-piece/images/white/';
 
export class ChessPiece {
   // here we are assuming x as row number and y as column number
    private moveCount: number;
    public prevX:number;
    public prevY:number;
    public sanCoordinate : string;
    private movementArray;
    public availableMove:boolean;
    constructor(public type: string,
        public color: string,
        public x: number,
        public y: number,
        
    ) {
        this.moveCount = 0;
        this.prevX = this.x;
        this.prevY = this.y;
        this.sanCoordinate = String.fromCharCode(this.y+96) + this.x;
        this.movementArray= new Array<any> ();
        this.availableMove = false;
    }

    
    returnCharacter(){
        if(this.color === "white"){
            if(this.type == "rook"){
                return ChessIconImgPath.WhiteRook;
            }
            else if(this.type == "knight"){
                return ChessIconImgPath.WhiteKnight;
            }
            else if(this.type == "bishop"){
                return ChessIconImgPath.WhiteBishop;
            }
            else if(this.type == "king"){
                return ChessIconImgPath.WhiteKing;
            }
            else if(this.type == "queen"){
                return ChessIconImgPath.WhiteQueen;
            }
            else if(this.type == "pawn"){
                return ChessIconImgPath.WhitePawn;
            }
        }
        else{
            if(this.type == "rook"){
                return ChessIconImgPath.BlackRook;
            }
            else if(this.type == "knight"){
                return ChessIconImgPath.BlackKnight;
            }
            else if(this.type == "bishop"){
                return ChessIconImgPath.BlackBishop;
            }
            else if(this.type == "king"){
                return ChessIconImgPath.BlackKing;
            }
            else if(this.type == "queen"){
                return ChessIconImgPath.BlackQueen;
            }
            else if(this.type == "pawn"){
                return ChessIconImgPath.BlackPawn;
            }
        }
        return '';
    }

    increaseMoveCount(){
        this.moveCount++;
    }

    getMoveCount(){
        return this.moveCount;
    }

    setEmptyMovementArray(){
        this.movementArray.length = 0;
    }
    insertMove(data){
        this.movementArray.push(data);
    }

    getMoves(){
        return this.movementArray;
    }

    changeCoordinates(x,y){
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = x;
        this.y =y;
        this.sanCoordinate = String.fromCharCode(y+96) + x;
    }

    // SAN -> Standard Algebric notation

    


}

export class ChessBoardState {

    // here we are assuming x as row number and y as column number
    public chessBoard = new Array(8);
    public chessBoardActive = new Array(8);
    private defeatedPiecesWhite = new Array();
    private defeatedPiecesBlack = new Array();

    constructor() {
        this.chessBoard.length = 8;
        this.initialSetUp();
    }

    initialSetUp() {


        for (let i = 0; i < 8; i++) {

            this.chessBoard[i] = new Array(8);
            this.chessBoardActive[i] = new Array(8);
            if (i == 0) {
                for (let j = 0; j < 8; j++) {
                    //place rook
                    if (j == 0) {
                        let chessPiece = new ChessPiece("rook", "white", i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;

                    }

                    //place knight
                    if (j == 1) {
                        let chessPiece = new ChessPiece("knight", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place bishop
                    if (j == 2) {
                        let chessPiece = new ChessPiece("bishop", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place king
                    if (j == 3) {
                        let chessPiece = new ChessPiece("king", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place queen
                    if (j == 4) {
                        let chessPiece = new ChessPiece("queen", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place bishop
                    if (j == 5) {
                        let chessPiece = new ChessPiece("bishop", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place knight
                    if (j == 6) {
                        let chessPiece = new ChessPiece("knight", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place rook
                    if (j == 7) {
                        let chessPiece = new ChessPiece("rook", "white",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }
                    this.chessBoardActive[i][j] = false;
                    //console.log(i + ": i --> j: " + j);

                }
            }
            //white pawns
            else if (i == 1) {
                for (let j = 0; j < 8; j++) {
                    let chessPiece = new ChessPiece("pawn", "white", i + 1, j + 1);
                    this.chessBoard[i][j] = chessPiece;
                    this.chessBoardActive[i][j] = false;
                    //console.log(i + ": i --> j: " + j);
                }

            }

            //black pawns
            else if (i == 6) {
                for (let j = 0; j < 8; j++) {
                    let chessPiece = new ChessPiece("pawn", "black", i + 1, j + 1);
                    this.chessBoard[i][j] = chessPiece;
                    this.chessBoardActive[i][j] = false;
                    //console.log(i + ": i --> j: " + j);

                }
            }
            //black chess-pieces
            else if (i == 7) {
                for (let j = 0; j < 8; j++) {
                    //place rook
                    if (j == 0) {
                        let chessPiece = new ChessPiece("rook", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place knight
                    if (j == 1) {
                        let chessPiece = new ChessPiece("knight", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place bishop
                    if (j == 2) {
                        let chessPiece = new ChessPiece("bishop", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place queen
                    if (j == 3) {
                        let chessPiece = new ChessPiece("queen", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place king
                    if (j == 4) {
                        let chessPiece = new ChessPiece("king", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place bishop
                    if (j == 5) {
                        let chessPiece = new ChessPiece("bishop", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place knight
                    if (j == 6) {
                        let chessPiece = new ChessPiece("knight", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }

                    //place rook
                    if (j == 7) {
                        let chessPiece = new ChessPiece("rook", "black",i+1, j+1);
                        this.chessBoard[i][j] = chessPiece;
                    }
                    this.chessBoardActive[i][j] = false;
                    //console.log(i + ": i --> j: " + j);

                }
            }

            //null values at all the places
            else {
                for (let j = 0; j < 8; j++) {
                    this.chessBoard[i][j] == null;
                    this.chessBoardActive[i][j] = false;
                    //console.log(i + ": i --> j: " + j);
                }
            }
        }
    }

    // SAN -> Standard Algebric notation

    getSanRankCoordinate(chessPiece:ChessPiece){
        return String.fromCharCode(chessPiece.y+96) + chessPiece.x; 
    }

    getCoordinate(chessPiece:ChessPiece){
        return String.fromCharCode(chessPiece.y+96) + chessPiece.x; 
    }

    insertDefeatedPiece(chessPiece:ChessPiece){
        if(chessPiece.color ==="black"){
            this.defeatedPiecesBlack.push(chessPiece);
        }
        else if(chessPiece.color === "white"){
            this.defeatedPiecesWhite.push(chessPiece);
        }
    }
    
    getDefeatedPiecesWhite(){
        return this.defeatedPiecesWhite;
    }

    getDefeatedPiecesBlack(){
        return this.defeatedPiecesBlack;
    }
    
}


