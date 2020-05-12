import { Injectable, EventEmitter } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable, Subject } from 'rxjs';
import { ChessBoardState, ChessPiece } from '../models/gameState.model';

export interface Coordinates {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArenaService {
  targetCoordinate: Coordinates;
  targetCoordinateChange: Subject<Coordinates> = new Subject<Coordinates>();
  sourceCoordinate: Coordinates;
  chessBoardState: ChessBoardState;
  playerNumber:number;

  constructor() {
    // this.targetCoordinateChange.subscribe((value) => {
    //   this.targetCoordinate = value;
    // });
    this.chessBoardState = new ChessBoardState();
    
  }

  setPlayer(number:number){
    this.playerNumber = number;
  }

  setTargetCoordinate(x, y) {
    this.targetCoordinate = {
      x: x,
      y: y
    };

    let changeCoordinate = {
      sourceCoordinate: this.sourceCoordinate,
      targetCoordinate: this.targetCoordinate
    }
    this.chessBoardState.chessBoard[this.sourceCoordinate.x-1][this.sourceCoordinate.y-1].increaseMoveCount();
    this.targetCoordinateChange.next(this.targetCoordinate);
  }

  setSourceCoordinate(x, y) {
    this.sourceCoordinate = {
      x: x,
      y: y
    };
  }

  changeBoardState(){
    for(let i=0;i<this.chessBoardState.chessBoard.length;i++){

      for(let j=0;j<this.chessBoardState.chessBoard[i].length;j++){

        let chessPiece:ChessPiece = this.chessBoardState.chessBoard[i][j];
        if(chessPiece){
          /* condition for pawn starts */
          if(chessPiece.type === "pawn") {

            /* condition for black pawn*/
            if(chessPiece.color === "black"){
              chessPiece.setEmptyMovementArray(); //empty the array

              //for loop to check forward moves
              for(let k=i-1;k>=0 && k>=i-2;k--){

                let piece:ChessPiece = this.chessBoardState.chessBoard[k][j];
                if(piece === undefined){

                  let coordinates:Coordinates = {
                    x : k+1,
                    y : j+1
                  }
                  
                  chessPiece.insertMove(coordinates);
                  if(chessPiece.getMoveCount() >= 1){
                    break;
                  }

                }
                else{
                  if(piece.color != chessPiece.color){
                    let coordinates:Coordinates = {
                      x : k+1,
                      y : j+1
                    }
                    chessPiece.insertMove(coordinates);
                  }
                  break;
                }
              }

              //diagonal opponent case for black pawn
              if(chessPiece.x > 1){

                //condition for left diagonal
                if(chessPiece.y > 1 && chessPiece.y <= this.chessBoardState.chessBoard.length){
                  let piece:ChessPiece = this.chessBoardState.chessBoard[chessPiece.x-2][chessPiece.y-2];
                  if(piece != undefined){
                    if(piece.color != chessPiece.color){
                      let coordinates:Coordinates = {
                        x : chessPiece.x - 1,
                        y : chessPiece.y - 1
                      }
                      chessPiece.insertMove(coordinates);
                      break;
                    }
                  }
                }
                //condition for right diagonal
                else if(chessPiece.y > 0 && chessPiece.y < this.chessBoardState.chessBoard.length){
                  let piece:ChessPiece = this.chessBoardState.chessBoard[chessPiece.x-2][chessPiece.y];
                  if(piece != undefined){
                    if(piece.color != chessPiece.color){
                      let coordinates:Coordinates = {
                        x : chessPiece.x - 1,
                        y : chessPiece.y
                      }
                      chessPiece.insertMove(coordinates);
                    }
                  }
                }
              }
            }
            /*condition for black pawn ends*/

            /* condition for white pawn*/
            else if(chessPiece.color === "white"){
              chessPiece.setEmptyMovementArray(); //empty the array

              //for loop to check forward moves
              for(let k=i+1;k<8 && k<=i+2;k++){

                let piece:ChessPiece = this.chessBoardState.chessBoard[k][j];
                if(piece === undefined){

                  let coordinates:Coordinates = {
                    x : k+1,
                    y : j+1
                  }
                  
                  chessPiece.insertMove(coordinates);
                  if(chessPiece.getMoveCount() === 1){
                    break;
                  }

                }
                else{
                  if(piece.color != chessPiece.color){
                    let coordinates:Coordinates = {
                      x : k+1,
                      y : j+1
                    }
                    chessPiece.insertMove(coordinates);
                  }
                  break;
                }
              }

              //diagonal opponent case for white pawn
              if(chessPiece.x < this.chessBoardState.chessBoard.length){

                //condition for left diagonal
                if(chessPiece.y > 1 && chessPiece.y <= this.chessBoardState.chessBoard.length){
                  let piece:ChessPiece = this.chessBoardState.chessBoard[chessPiece.x][chessPiece.y-2];
                  if( piece != undefined){
                    if(piece.color != chessPiece.color){
                      let coordinates:Coordinates = {
                        x : chessPiece.x,
                        y : chessPiece.y - 2
                      }
                      chessPiece.insertMove(coordinates);
                      break;
                    }
                  }
                }
                //condition for right diagonal
                else if(chessPiece.y > 0 && chessPiece.y < this.chessBoardState.chessBoard.length){
                  let piece:ChessPiece = this.chessBoardState.chessBoard[chessPiece.x][chessPiece.y];
                  if(piece != undefined){
                    if(piece.color != chessPiece.color){
                      let coordinates:Coordinates = {
                        x : chessPiece.x,
                        y : chessPiece.y
                      }
                      chessPiece.insertMove(coordinates);
                    }
                  }
                }
              }
            }
            /*condition for white pawn ends*/
          }
          /* condition for pawn ends*/
          else if(chessPiece.type === "rook") {
      
          }
          else if(chessPiece.type === "knight") {
      
          }
          else if(chessPiece.type === "bishop") {
      
          }
          else if(chessPiece.type === "queen"){
      
          }
          else if(chessPiece.type === "king"){
      
          }
        }
      }
    }

  }


  getPieceMoves(chessPiece: ChessPiece) {
    if(chessPiece.getMoves().length>0){
      chessPiece.getMoves().forEach( (move:Coordinates) => {
        this.chessBoardState.chessBoardActive[move.x-1][move.y-1]=true;
        // this.chessBoardState.chessBoard[move.x-1][move.y-1].isAvailablePlace = true; 
      });
    }
  }

  erasePieceMoves(chessPiece: ChessPiece) {
    if(chessPiece.getMoves().length>0){
      chessPiece.getMoves().forEach( (move:Coordinates) => {
        this.chessBoardState.chessBoardActive[move.x-1][move.y-1]=false;
        // this.chessBoardState.chessBoard[move.x-1][move.y-1].isAvailablePlace = false; 
      });
    }
  }
}
