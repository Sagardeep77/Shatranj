import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import { ChessBoardState, ChessPiece } from '../models/gameState.model';
import { ArenaService } from '../services/arena.service';
import { SocketService } from '../services/socket.service';
import { element } from 'protractor';
import { GsapAnimationService } from '../gsap-animation.service';



// import { TimelineMax, CSSPlugin, ScrollToPlugin, Draggable } from "gsap/all"; 


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit, OnChanges {
  @Input() playerNumber: number;
  @Input() isClassic: boolean;
  @Input() isDimension3D: boolean;
  canAccessColor: string;
  draggedColumn;
  selectedChessPiece;
  constructor(private arenaService: ArenaService, private socketService: SocketService, private gsapAnimationService: GsapAnimationService) { }

  ngOnInit() {
    this.socketService.getOpponentTurn().subscribe((data: ChessPiece) => {
      this.opponentMove(data);
    });

    if (this.playerNumber === 1) {

      this.canAccessColor = "black";
    }
    if (this.playerNumber === 2) {
      this.canAccessColor = "white";
    }
    console.log(this.playerNumber + "->" + this.canAccessColor)
    this.arenaService.canAccessColor = this.canAccessColor;
    this.arenaService.setPlayer(this.playerNumber);
    this.arenaService.changeBoardState();
    console.log(this.arenaService.generateFEN(this.arenaService.chessBoardState));
  }

  ngOnChanges() {
    // this.chessBoardAnimation();
  }
  ngAfterViewInit() {

  }

  handleDragOver(event) {
    // this / event.target is current target element.
    // console.log(event);
    if (event.preventDefault) {
      event.preventDefault(); /* Necessary. Allows us to drop. */
    }
    event.dataTransfer.dropEffect = 'move';  /* See the section on the DataTransfer object. */
    return false;
  }

  handleDrop(event, x, y) {
    // this / event.target is current target element.
    // console.log(event,"i -->"+x,"j-->"+y);
    let targetChange = this.arenaService.setTargetCoordinate(x, y);
    if (targetChange) {
      let isValidMove = this.arenaService.isValidMove(this.selectedChessPiece, this.arenaService.targetCoordinate);
      if (isValidMove) {
        this.arenaService.chessBoardState.chessBoard[this.arenaService.sourceCoordinate.x - 1][this.arenaService.sourceCoordinate.y - 1].increaseMoveCount();
        this.arenaService.chess.move(
          {
            from: this.selectedChessPiece.sanCoordinate,
            to: this.arenaService.coordinateToSanRank(this.arenaService.targetCoordinate)
          }
        );
        console.log(this.arenaService.chess.ascii());
        this.arenaService.targetCoordinateChange.next(this.arenaService.targetCoordinate);

        event.preventDefault(); /* prevents the default behaviour of browser (eg. Drag and drop) */

        
        console.log(this.selectedChessPiece);

        /* send the selected chessPiece to the opponent */
        

        let temp = this.arenaService.chessBoardState.chessBoard[x - 1][y - 1];
        this.arenaService.chessBoardState.chessBoard[x - 1][y - 1] = this.selectedChessPiece;

        this.arenaService.chessBoardState.chessBoard[this.selectedChessPiece.prevX - 1][this.selectedChessPiece.prevY - 1] = undefined;

        this.arenaService.erasePieceMoves(this.selectedChessPiece);
        this.arenaService.isplayerTurn = false;
        console.log("Black defeated -> ", this.arenaService.chessBoardState.getDefeatedPiecesBlack());
        console.log("White defeated -> ", this.arenaService.chessBoardState.getDefeatedPiecesWhite());

        if(this.arenaService.isOpponentBot){
          this.botsTurn(this.selectedChessPiece);
        }
        else{
          this.socketService.sendDragDropData(this.selectedChessPiece);
        }
        

      }


    }

  }
  botsTurn(chessPiece:ChessPiece) {
    
  }

  sendDataEvent(data) {
    this.selectedChessPiece = data;
  }

  opponentMove(data: ChessPiece) {
    this.arenaService.chessBoardState.chessBoard[data.prevX - 1][data.prevY - 1] = undefined;
    let temp = new ChessPiece(data.type, data.color, data.x, data.y);
    temp.prevX = data.prevX;
    temp.prevY = data.prevY;

    console.log(temp);
    if (this.arenaService.chessBoardState.chessBoard[data.x - 1][data.y - 1] != undefined) {
      this.arenaService.chessBoardState.insertDefeatedPiece(this.arenaService.chessBoardState.chessBoard[data.x - 1][data.y - 1]);
    }
    this.arenaService.chessBoardState.chessBoard[data.x - 1][data.y - 1] = temp;

    //move the tile in chess.js
    this.arenaService.chess.move(
      {
        from: this.arenaService.coordinateToSanRank({x:data.prevX,y:data.prevY}),
        to: this.arenaService.coordinateToSanRank({x:data.x,y:data.y})
      }
    );
    this.arenaService.changeBoardState();
    console.log(this.arenaService.generateFEN(this.arenaService.chessBoardState));

    this.arenaService.isplayerTurn = true;

  }


  checkAvailablePlace(x: number, y: number) {
    if (this.arenaService.chessBoardState.chessBoardActive[x][y] === true) {
      return true;
    }
    return false;
  }
}
