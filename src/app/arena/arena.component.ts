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
  message="Client->sServer";
  activePlayers:any;
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
      });

      this.socketService.sendMessage(this.message);
      this.socketService.onMessage().subscribe((data)=>{
        console.log(data);
      })
      
    }
    else 
      this.activePlayers="No active players";
  }

  
  sendMessage(){
    this.socketService.sendMessage(this.message);
    
  }

}
