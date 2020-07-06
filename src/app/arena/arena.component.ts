import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ArenaService } from '../services/arena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataCommunicationService } from '../services/data-communication.service';
import { TimelineMax, CSSPlugin, ScrollToPlugin, Draggable } from "gsap/all";


@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})

export class ArenaComponent implements OnInit {

  activePlayers: any;

  arenaStatus: boolean;
  status: string;
  playerNo: number;
  joinedFirst: boolean = false;
  isClassic:boolean = true;
  isDimension3D: boolean = false;

  constructor(private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private dataCommService: DataCommunicationService,
    private route: Router,
    private arenaService: ArenaService) {
  }

  async ngOnInit() {
    let code = <number>this.activatedRoute.snapshot.params.code;
    let connect = await this.socketService.connect(code);
    if (connect == "Connected") {
      this.socketService.activeConnections().subscribe((data) => {
        this.activePlayers = data;
        if (this.activePlayers.activePlayers == 1) {
          this.arenaStatus = false;
          this.status = "Waiting for player 2"
          this.joinedFirst = true;
        }
        else {
          this.arenaStatus = true;
          if (this.joinedFirst === true) {
            this.playerNo = 1;
          }
          else {
            this.playerNo = 2;
          }
          setInterval(()=>{
            this.makeTimer()
          },1000);
        }
      });


      this.socketService.onPlayerLeft().subscribe((data) => {
        this.status = "Player " + data + " left";
      })

    }
    else
      this.activePlayers = false;
  }



  selectedIndex = 0;
  transformStyle;
  // var carousel = document.querySelector('.carousel');
  // var cellCount = 3;
  angle;
  rotateCarousel() {
    if (this.selectedIndex == 0) {
      this.angle = 0;
    }
    else if (this.selectedIndex == -1) {
      this.angle = 20;
    }
    else if (this.selectedIndex == 1) {
      this.angle = -20;
    }
    else {
      return;
    }
    this.transformStyle = {
      'transform': 'translateZ(-288px) rotateY(' + this.angle + 'deg)'
    };
  }

  previous() {
    if (this.selectedIndex < 2 && this.selectedIndex > -1) {
      this.selectedIndex--;
    }
    this.rotateCarousel();
  }


  next() {
    if (this.selectedIndex < 1 && this.selectedIndex > -2) {
      this.selectedIndex++;
    }
    this.rotateCarousel();
  };

  showButton() {
    return this.transformStyle;
  }


  minutes = 0;
  seconds = 60;

  makeTimer() {

    if (this.seconds > 0 ) { this.seconds--; }
}

}
