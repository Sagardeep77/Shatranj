import { Component, OnInit, Input, Output, OnChanges, ViewChild } from '@angular/core';
import { ChessPiece } from '../models/gameState.model';
import { TweenMax, Linear } from 'gsap';
import { EventEmitter } from '@angular/core';
import { ArenaService } from '../services/arena.service';
import { GsapAnimationService } from '../gsap-animation.service';
export interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-chess-piece',
  templateUrl: './chess-piece.component.html',
  styleUrls: ['./chess-piece.component.css']
})
export class ChessPieceComponent implements OnInit {
  @ViewChild('draggableDiv', { static: false }) draggableDiv;
  @Input() chessPiece: ChessPiece;
  @Input() canAccessColor: string;
  @Input() x: number;
  @Input() y: number;
  @Input() isAvailablePlace: boolean;
  @Output() dragDropEvent: EventEmitter<any> = new EventEmitter();
  canDrag;
  chessPieceClass;
  prevChessPiece;
  newChessPiece;
  isChessPiece: boolean = false;
  subscription;


  constructor(private arenaService: ArenaService,private gsapAnimationService:GsapAnimationService) {

  }

  ngOnInit() {
    if (this.chessPiece != undefined) {
      this.isChessPiece = true;
      this.prevChessPiece = this.chessPiece;
      this.setChessPieceClass(this.chessPiece);
      let c = document.getElementsByClassName("chess-board-piece");
      if(c.length === 64){
        this.gsapAnimationService.chessBoardAnimation(c);
      }
    }
  }

  playerNumber() {
    if (this.arenaService.playerNumber === 2)
      return true;
    return false;
  }

  //function for checking the color type of player with chess-piece type

  checkColor(): boolean {
    if (this.canAccessColor == this.chessPiece.color) {
      return true;
    }
    return false;
  }


  //function to set the class of chess piece
  setChessPieceClass(chessPiece) {

    if (chessPiece.color === "black") {
      if (chessPiece.type === "king") {
        this.chessPieceClass = "piece-black-king";
        // console.log(this.chessPieceClass);
      }
      else if (chessPiece.type === "queen") {
        this.chessPieceClass = "piece-black-queen";
      }
      else if (chessPiece.type === "bishop") {
        this.chessPieceClass = "piece-black-bishop";
      }
      else if (chessPiece.type === "knight") {
        this.chessPieceClass = "piece-black-knight";
      }
      else if (chessPiece.type === "rook") {
        this.chessPieceClass = "piece-black-rook";
      }
      else if (chessPiece.type === "pawn") {
        this.chessPieceClass = "piece-black-pawn";
      }
    }
    else if (chessPiece.color === "white") {
      if (chessPiece.type === "king") {
        this.chessPieceClass = "piece-white-king";
      }
      else if (chessPiece.type === "queen") {
        this.chessPieceClass = "piece-white-queen";
      }
      else if (chessPiece.type === "bishop") {
        this.chessPieceClass = "piece-white-bishop";
      }
      else if (chessPiece.type === "knight") {
        this.chessPieceClass = "piece-white-knight";
      }
      else if (chessPiece.type === "rook") {
        this.chessPieceClass = "piece-white-rook";
      }
      else if (chessPiece.type === "pawn") {
        this.chessPieceClass = "piece-white-pawn";
      }
    }
  }

  // function for the hover effect of chess piece (GSAP Animation)
  pieceHover(event) {
    if (this.arenaService.isplayerTurn) {
      // console.log(piece)
      this.canDrag = this.checkColor();
      if (event.type === "mouseenter" && this.canDrag) {
        let element = event.target;
        TweenMax.to(element, 0.4, {
          autoAlpha: 1,
          ease: Linear.easeNone,
          zIndex: 1,
          scaleX: 1.2,
          scaleY: 1.2,
        });

        this.arenaService.getPieceMoves(this.chessPiece);
      }
      if (event.type === "mouseleave" && this.canDrag) {
        let element = event.target;
        TweenMax.to(element, 0.4, {
          autoAlpha: 1,
          ease: Linear.easeNone,
          zIndex: 0,
          scaleX: 1,
          scaleY: 1
        });

        this.arenaService.erasePieceMoves(this.chessPiece);
      }
    }
  }

  /*
     This funtion runs when the chess piece start dragging and sets source Cordintaes in arenaService. 
     This function change the coordinates of the chess piece if the targetCoordinates are valid.
  */
  handleDragStart(event) {
    if (!this.canDrag || !this.arenaService.isplayerTurn) {
      event.preventDefault();
    }
    this.dragDropEvent.emit(this.chessPiece);
    this.arenaService.setSourceCoordinate(this.x, this.y);
    this.subscription = this.arenaService.targetCoordinateChange.subscribe((data) => {
      this.x = data.x;
      this.y = data.y;
      this.chessPiece.changeCoordinates(data.x, data.y);
      
      this.unsubscribe(true);
    });
    event.dataTransfer.effectAllowed = 'move'; 
  }

  handleDragEnter(event) {
    if (event.preventDefault) {
      event.preventDefault(); // Necessary. Allows us to drop.
    }
  }

  handleDragOver(event) {
    // this / event.target is current target element.
    // console.log(event);
    if (event.preventDefault) {
      event.preventDefault(); // Necessary. Allows us to drop.
    }
    event.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
  }

  unsubscribe(targetCoordinateRcvd) {
    if (targetCoordinateRcvd) {
      this.subscription.unsubscribe();
    }
  }

}
