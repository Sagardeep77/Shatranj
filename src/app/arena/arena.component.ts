import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ArenaService } from '../services/arena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataCommunicationService } from '../services/data-communication.service';


export interface Message {
  "text" : String;
  "sender":String;
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})

export class ArenaComponent implements OnInit {
  
  activePlayers:any;
  sentMessage:String;
  messages = new Array<Message>();
  arenaStatus: boolean;
  status:string;
  constructor(private socketService:SocketService,
    private activatedRoute:ActivatedRoute,
    private dataCommService:DataCommunicationService,
    private route : Router) {
    
   }

  async ngOnInit() {
    let code = <number>this.activatedRoute.snapshot.params.code;
    let connect = await this.socketService.connect(code)
    if(connect=="Connected"){

      this.socketService.activeConnections().subscribe((data)=>{
        this.activePlayers=data;
        if(this.activePlayers.activePlayers == 1){
          this.arenaStatus = false;
          this.status="Waiting for player 2"
        }
        else{
          this.arenaStatus = true;
        }
      });

      
      this.socketService.onMessage().subscribe((data)=>{
        // console.log(data);
        let message : Message;
        message = {
          "text" : data,
          "sender" : 'opponent'
        }
        this.messages.push(message);
      });

      this.socketService.onPlayerLeft().subscribe((data)=>{
        this.status="Player "+data+ " left";
      })
      
    }
    else 
      this.activePlayers=false;
  }

  
  sendMessage(){
    this.socketService.sendMessage(this.sentMessage);
    let message : Message;
    message = {
      "text" : this.sentMessage,
      "sender" : 'self'
    }
    this.messages.push(message);
  }

}
