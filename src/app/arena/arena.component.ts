import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ArenaService } from '../services/arena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataCommunicationService } from '../services/data-communication.service';



@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})

export class ArenaComponent implements OnInit {
  
  activePlayers:any;
 
  arenaStatus: boolean;
  status:string;
  playerNo:number;
  joinedFirst:boolean = false;
 
  constructor(private socketService:SocketService,
    private activatedRoute:ActivatedRoute,
    private dataCommService:DataCommunicationService,
    private route : Router,
    private arenaService:ArenaService) {
   }

  async ngOnInit() {
    let code = <number>this.activatedRoute.snapshot.params.code;
    let connect = await this.socketService.connect(code);
    if(connect=="Connected"){
      this.socketService.activeConnections().subscribe((data)=>{
        this.activePlayers=data;
        if(this.activePlayers.activePlayers == 1){
          this.arenaStatus = false;
          this.status="Waiting for player 2"
          this.joinedFirst = true;
        }
        else{
          this.arenaStatus = true;
          if(this.joinedFirst === true){
            this.playerNo = 1;
          }
          else{
            this.playerNo = 2;
          }
        }
      });

      
      this.socketService.onPlayerLeft().subscribe((data)=>{
        this.status="Player "+data+ " left";
      })
      
    }
    else 
      this.activePlayers=false;
  }

  
  

}
