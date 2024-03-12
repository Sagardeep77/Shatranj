import { Injectable, EventEmitter, Optional } from '@angular/core';
// import { SocketService } from './socket.service';
import { Observable, Subject, Subscription } from 'rxjs';
import * as Chess from "chess.js";



import { ChessBoardState, ChessPiece } from '../models/gameState.model';

// declare var STOCKFISH: any;

export interface Coordinates {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArenaService{
  

  public chess: Chess = new Chess();

  targetCoordinate: Coordinates;
  targetCoordinateChange: Subject<Coordinates> = new Subject<Coordinates>();
  sourceCoordinate: Coordinates;
  chessBoardState: ChessBoardState;
  playerNumber: number;
  isOpponentBot: boolean = false;
  isplayerTurn: boolean = true;
  canAccessColor: string;
  chessPieceMoves: any;

  private onStockfishMessageSubscription: Subscription;

  constructor() {
    // this.targetCoordinateChange.subscribe((value) => {
    //   this.targetCoordinate = value;
    // });
    this.chessBoardState = new ChessBoardState();

  }

  //Function to set the player number
  setPlayer(number: number) {
    this.playerNumber = number;
  }

  /* 
    Function to set the Target Co-ordinates and check whether the coordinates changed or not
      -> if co-ordinates changed 
            then it checks for the valid moves 
              if the move is valid it return truel and change the cchessboard
  */
  setTargetCoordinate(x, y): boolean {
    this.targetCoordinate = {
      x: x,
      y: y
    };

    if ((this.sourceCoordinate.x != this.targetCoordinate.x) || (this.sourceCoordinate.y != this.targetCoordinate.y)) {
      let changeCoordinate = {
        sourceCoordinate: this.sourceCoordinate,
        targetCoordinate: this.targetCoordinate
      }
      return true;
    }
    return false;
  }

  //Funtion to set the source Coordinates
  setSourceCoordinate(x, y) {
    this.sourceCoordinate = {
      x: x,
      y: y
    };
  }

  /* Function to generate FEN string*/

  generateFEN(chessBoardState: ChessBoardState) {
    let board = chessBoardState.chessBoard;
    let rankSeperator = '/';

    let FEN = "";

    for (let rank = 0; rank < board.length; rank++) {

      //count empty pieces in chessboard
      let empty = 0;

      //empty string for each length
      let rankFEN = "";

      for (let file = 0; file < board[rank].length; file++) {
        if (board[rank][file] == undefined) {
          empty++;
        } else {
          // add the number to the fen if not zero.
          if (empty != 0) rankFEN += empty;
          // add the letter to the fen
          rankFEN += board[rank][file].returnCharacter();
          // reset the empty
          empty = 0;
        }
      }
      // add the number to the fen if not zero.
      if (empty != 0) rankFEN += empty;
      // add the rank to the fen
      FEN += rankFEN;
      // add rank separator. If last then add a space
      if (!(rank == board.length - 1)) {
        FEN += rankSeperator;
      } else {
        FEN += " ";
      }
    }
    return this.reverseString(FEN);
  }

  reverseString(s) {
    return s.split("").reverse().join("");
  }

  coordinateToSanRank(coordinates: Coordinates) {
    return String.fromCharCode(coordinates.y + 96) + coordinates.x;
  }

  sanRankToCoordinate(san) {

    return { x: parseInt(san[san.length - 1]), y: san.charCodeAt(san.length - 2) - 96 };
  }

  moveChessPiece(move: Coordinates) {
    let sanRank = this.coordinateToSanRank(move);
    this.chessPieceMoves = this.chess.move(sanRank)
  }

  /* Function to change board state with the help of chess.js library */

  changeBoardState() {
    for (let i = 0; i < this.chessBoardState.chessBoard.length; i++) {
      for (let j = 0; j < this.chessBoardState.chessBoard[i].length; j++) {
        let chessPiece: ChessPiece = this.chessBoardState.chessBoard[i][j];
        if (chessPiece) {
          if (chessPiece.color === this.canAccessColor) {
            chessPiece.setEmptyMovementArray();
            let moves = this.chess.moves({ square: chessPiece.sanCoordinate });
            // console.log("moves -->", moves);
            moves.forEach(move => {
              let coordinates: Coordinates = this.sanRankToCoordinate(move);
              chessPiece.insertMove(coordinates);
            });
          }
        }
      }
    }
    
    console.log(this.chess.ascii());
  }


  /*
    Function to change the chess board state if any of the players moves.
  
      It goes through each and every tile of chessBoard and if their is a piece
        then it sets the possible places where a piece can move (in chessPiece->moveArray).
  */
  // changeBoardState() {
  //   for (let i = 0; i < this.chessBoardState.chessBoard.length; i++) {

  //     for (let j = 0; j < this.chessBoardState.chessBoard[i].length; j++) {

  //       let chessPiece: ChessPiece = this.chessBoardState.chessBoard[i][j];
  //       if (chessPiece) {
  //         if (chessPiece.color === this.canAccessColor) {
  //           /* condition for pawn starts */
  //           if (chessPiece.type === "pawn") {

  //             /* condition for black pawn*/
  //             if (chessPiece.color === "black") {
  //               chessPiece.setEmptyMovementArray(); //empty the array

  //               //for loop to check forward moves
  //               for (let k = i - 1; k >= 0 && k >= i - 2; k--) {

  //                 let piece: ChessPiece = this.chessBoardState.chessBoard[k][j];
  //                 if (piece === undefined) {

  //                   let coordinates: Coordinates = {
  //                     x: k + 1,
  //                     y: j + 1
  //                   }

  //                   chessPiece.insertMove(coordinates);
  //                   if (chessPiece.getMoveCount() >= 1) {
  //                     break;
  //                   }

  //                 }
  //                 else {
  //                   // if (piece.color != chessPiece.color) {
  //                   //   let coordinates: Coordinates = {
  //                   //     x: k + 1,
  //                   //     y: j + 1
  //                   //   }
  //                   //   chessPiece.insertMove(coordinates);
  //                   // }
  //                   break;
  //                 }
  //               }

  //               //diagonal opponent case for black pawn
  //               if (chessPiece.x > 1) {

  //                 //condition for left diagonal
  //                 if (chessPiece.y > 1 && chessPiece.y <= this.chessBoardState.chessBoard.length) {
  //                   let piece: ChessPiece = this.chessBoardState.chessBoard[chessPiece.x - 2][chessPiece.y - 2];
  //                   if (piece != undefined) {
  //                     if (piece.color != chessPiece.color) {
  //                       let coordinates: Coordinates = {
  //                         x: piece.x,
  //                         y: piece.y
  //                       }
  //                       chessPiece.insertMove(coordinates);

  //                     }
  //                   }
  //                 }
  //                 //condition for right diagonal
  //                 if (chessPiece.y > 0 && chessPiece.y < this.chessBoardState.chessBoard.length) {
  //                   let piece: ChessPiece = this.chessBoardState.chessBoard[chessPiece.x - 2][chessPiece.y];
  //                   if (piece != undefined) {
  //                     if (piece.color != chessPiece.color) {
  //                       let coordinates: Coordinates = {
  //                         x: piece.x,
  //                         y: piece.y
  //                       }
  //                       chessPiece.insertMove(coordinates);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             /*condition for black pawn ends*/

  //             /* condition for white pawn*/
  //             else if (chessPiece.color === "white") {
  //               chessPiece.setEmptyMovementArray(); //empty the array

  //               //for loop to check forward moves
  //               for (let k = i + 1; k < 8 && k <= i + 2; k++) {

  //                 let piece: ChessPiece = this.chessBoardState.chessBoard[k][j];
  //                 if (piece === undefined) {

  //                   let coordinates: Coordinates = {
  //                     x: k + 1,
  //                     y: j + 1
  //                   }

  //                   chessPiece.insertMove(coordinates);
  //                   if (chessPiece.getMoveCount() >= 1) {
  //                     break;
  //                   }

  //                 }
  //                 else {
  //                   // if (piece.color != chessPiece.color) {
  //                   //   let coordinates: Coordinates = {
  //                   //     x: k + 1,
  //                   //     y: j + 1
  //                   //   }
  //                   //   chessPiece.insertMove(coordinates);
  //                   // }
  //                   break;
  //                 }
  //               }

  //               //diagonal opponent case for white pawn
  //               if (chessPiece.x < this.chessBoardState.chessBoard.length) {

  //                 //condition for left diagonal
  //                 if (chessPiece.y > 0 && chessPiece.y < this.chessBoardState.chessBoard.length) {
  //                   let piece: ChessPiece = this.chessBoardState.chessBoard[chessPiece.x][chessPiece.y];
  //                   if (piece != undefined) {
  //                     if (piece.color != chessPiece.color) {
  //                       let coordinates: Coordinates = {
  //                         x: piece.x,
  //                         y: piece.y
  //                       }
  //                       chessPiece.insertMove(coordinates);
  //                     }
  //                   }
  //                 }
  //                 //condition for right diagonal
  //                 if (chessPiece.y > 1 && chessPiece.y <= this.chessBoardState.chessBoard.length) {
  //                   let piece: ChessPiece = this.chessBoardState.chessBoard[chessPiece.x][chessPiece.y - 2];
  //                   if (piece != undefined) {
  //                     if (piece.color != chessPiece.color) {
  //                       let coordinates: Coordinates = {
  //                         x: piece.x,
  //                         y: piece.y
  //                       }
  //                       chessPiece.insertMove(coordinates);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             /*condition for white pawn ends*/
  //           }
  //           /* condition for pawn ends*/

  //           /* condition for rook starts */
  //           else if (chessPiece.type === "rook") {
  //             /*for rook we have to check all the directions east, west, north, south */

  //             chessPiece.setEmptyMovementArray();
  //             //for east condition
  //             for (let k = i + 1; k < this.chessBoardState.chessBoard.length; k++) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for west condition
  //             for (let k = i - 1; k >= 0; k--) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north condtion
  //             for (let k = j - 1; k >= 0; k--) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for south direction
  //             for (let k = j + 1; k < this.chessBoardState.chessBoard.length; k++) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //           }
  //           /* condition for rook ends */

  //           /* condition for knight starts */
  //           else if (chessPiece.type === "knight") {
  //             /*for knight we have to check all the 8 possibilities Up(U) , Down(D), Left(L), Right(R)  */

  //             chessPiece.setEmptyMovementArray();
  //             //for L1 & U2
  //             let k = i + 2;
  //             let l = j - 1;
  //             if (k < this.chessBoardState.chessBoard.length && l>=0) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for R1 & U2
  //             k = i + 2;
  //             l = j + 1;
  //             if (k < this.chessBoardState.chessBoard.length && l < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for L1 & D2
  //             k = i - 2;
  //             l = j - 1;
  //             if (k >= 0 && l >= 0) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for R1 & D2
  //             k = i - 2;
  //             l = j + 1;
  //             if (k >= 0 && l < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for L2 & U1
  //             k = i - 1;
  //             l = j + 2;
  //             if (l < this.chessBoardState.chessBoard.length && k>=0) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for R2 & U1
  //             k = i + 1;
  //             l = j + 2;
  //             if (k < this.chessBoardState.chessBoard.length && l < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for L2 & D1
  //             k = i - 1;
  //             l = j - 2;
  //             if (k >= 0 && l >= 0) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for R1 & D2
  //             k = i + 1;
  //             l = j - 2;
  //             if (l >= 0 && k < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //           }

  //           /*condition for knight ends */


  //           /* condition for bishop starts */
  //           else if (chessPiece.type === "bishop") {
  //             /*for bishop we have to check all the directions north-east, north-west, south-east, south-west */

  //             chessPiece.setEmptyMovementArray();
  //             //for south-east condition
  //             for (let k = i + 1, l = j + 1; k < this.chessBoardState.chessBoard.length && l < this.chessBoardState.chessBoard.length; k++, l++) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north-west condition
  //             for (let k = i - 1, l = j - 1; k >= 0 && l >= 0; k--, l--) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north-east condtion
  //             for (let k = i + 1, l = j - 1; k < this.chessBoardState.chessBoard.length && l >= 0; k++, l--) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for south-west direction
  //             for (let k = i - 1, l = j + 1; j < this.chessBoardState.chessBoard.length && k >= 0; k--, l++) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //           }
  //           /* condition for bishop ends */

  //           /* condition for queen starts */
  //           else if (chessPiece.type === "queen") {
  //             /* for queen we have to check all the directions north, south, east,west, north-east, north-west, south-east, south-west */

  //             chessPiece.setEmptyMovementArray();
  //             //for east condition
  //             for (let k = i + 1; k < this.chessBoardState.chessBoard.length; k++) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for west condition
  //             for (let k = i - 1; k >= 0; k--) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north condtion
  //             for (let k = j - 1; k >= 0; k--) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for south direction
  //             for (let k = j + 1; k < this.chessBoardState.chessBoard.length; k++) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for south-east condition
  //             for (let k = i + 1, l = j + 1; k < this.chessBoardState.chessBoard.length && l < this.chessBoardState.chessBoard.length; k++, l++) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north-west condition
  //             for (let k = i - 1, l = j - 1; k >= 0 && l >= 0; k--, l--) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for north-east condtion
  //             for (let k = i + 1, l = j - 1; k < this.chessBoardState.chessBoard.length && l >= 0; k++, l--) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for south-west direction
  //             for (let k = i - 1, l = j + 1; j < this.chessBoardState.chessBoard.length && k >= 0; k--, l++) {
  //               let piece = this.chessBoardState.chessBoard[k][l];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //                 break;
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: l + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //           }
  //           /*condition for queen ends */

  //           /* condition for king  starts */
  //           else if (chessPiece.type === "king") {
  //             /*for king we have to check all the directions east, west, north, south */

  //             chessPiece.setEmptyMovementArray();
  //             //for east condition
  //             let k = i + 1;
  //             if (k < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //             //for west condition
  //             k = i - 1;
  //             if (k >= 0) {
  //               let piece = this.chessBoardState.chessBoard[k][j];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: k + 1,
  //                   y: j + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for north condtion
  //             k = j - 1;
  //             if (k >= 0) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }

  //             //for south direction
  //             k = j + 1;
  //             if (k < this.chessBoardState.chessBoard.length) {
  //               let piece = this.chessBoardState.chessBoard[i][k];
  //               if (piece != undefined) {
  //                 if (piece.color != chessPiece.color) {
  //                   let coordinates: Coordinates = {
  //                     x: piece.x,
  //                     y: piece.y
  //                   }
  //                   chessPiece.insertMove(coordinates);
  //                 }
  //               }
  //               else if (piece == undefined) {
  //                 let coordinates: Coordinates = {
  //                   x: i + 1,
  //                   y: k + 1
  //                 }
  //                 chessPiece.insertMove(coordinates);
  //               }
  //             }
  //           }
  //           /* condition fr king ends */
  //         }
  //       }
  //     }

  //   }
  // }


  //Function set the ActivePlaces of chessBoard where a chesspiece can move.
  getPieceMoves(chessPiece: ChessPiece) {
    if (chessPiece.getMoves().length > 0) {
      chessPiece.getMoves().forEach((move: Coordinates) => {
        this.chessBoardState.chessBoardActive[move.x - 1][move.y - 1] = true;
        // this.chessBoardState.chessBoard[move.x-1][move.y-1].isAvailablePlace = true; 
      });
    }
  }

  /*
    Function to check the valid move.it iterates through moveArray and 
    checks the target place with th possible places 
  */
  isValidMove(chessPiece: ChessPiece, targetCoordinate: Coordinates): boolean {
    let isValid = false;
    if (chessPiece.getMoves().length > 0) {
      chessPiece.getMoves().forEach((move: Coordinates) => {
        if ((move.x == targetCoordinate.x) && (move.y == targetCoordinate.y)) {
          isValid = true;
        }
      });
    }
    return isValid;
  }

  //Function Deactivate all the ActivePlaces of chesspiece .
  erasePieceMoves(chessPiece: ChessPiece) {
    if (chessPiece.getMoves().length > 0) {
      chessPiece.getMoves().forEach((move: Coordinates) => {
        this.chessBoardState.chessBoardActive[move.x - 1][move.y - 1] = false;
        // this.chessBoardState.chessBoard[move.x-1][move.y-1].isAvailablePlace = false; 
      });
    }
  }




/* New stockfish import by script */

  

}
