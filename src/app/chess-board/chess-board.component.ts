import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core'; 
import { ChessBoardState, ChessPiece } from '../models/gameState.model';
import { ArenaService } from '../services/arena.service';
import { SocketService } from '../services/socket.service';
import { element } from 'protractor';



// import { TimelineMax, CSSPlugin, ScrollToPlugin, Draggable } from "gsap/all"; 


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  @Input() playerNumber:number;
  canAccessColor:string;
  draggedColumn;
  selectedChessPiece;
  constructor(private arenaService:ArenaService,private socketService:SocketService) { }

  ngOnInit() {
    this.socketService.getOpponentTurn().subscribe((data:ChessPiece)=>{
      this.opponentMove(data);
    });

    if(this.playerNumber === 1){

      this.canAccessColor = "black";
    }
    if(this.playerNumber===2) {
      this.canAccessColor = "white";
    }
    console.log(this.playerNumber +"->"+ this.canAccessColor)
    this.arenaService.setPlayer(this.playerNumber);
    this.arenaService.changeBoardState();
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

  handleDrop(event,x,y) {
    // this / event.target is current target element.
    // console.log(event,"i -->"+x,"j-->"+y);
    this.arenaService.setTargetCoordinate(x,y);
    event.preventDefault();

    let temp = this.arenaService.chessBoardState.chessBoard[x-1][y-1] ;
    this.arenaService.chessBoardState.chessBoard[x-1][y-1] = this.selectedChessPiece ;
    this.arenaService.chessBoardState.chessBoard[this.selectedChessPiece.prevX-1][this.selectedChessPiece.prevY-1] = temp;    

    this.arenaService.erasePieceMoves(this.selectedChessPiece);
    this.arenaService.changeBoardState();
  }
  
  sendDataEvent(data){
    this.selectedChessPiece = data ;
    console.log(data);
    this.socketService.sendDragDropData(data);
  }

  opponentMove(data:ChessPiece){
    this.arenaService.chessBoardState.chessBoard[data.prevX-1][data.prevY-1] = undefined;
    let temp = new ChessPiece(data.type,data.color,data.x,data.y);
    temp.prevX = data.prevX;
    temp.prevY = data.prevY;
    this.arenaService.chessBoardState.chessBoard[data.x-1][data.y-1] = temp;;
    console.log(temp);
  }


  checkAvailablePlace(x:number,y:number){
    if(this.arenaService.chessBoardState.chessBoardActive[x][y] === true ){
      return true;
    }
    return false;
  }
}