import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '../services/data-communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  linkSuccess: boolean;
  generatedLink: string;
  code: number;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private socketService:SocketService,
    private dataCommService:DataCommunicationService
  ) { }

  ngOnInit() {
    this.linkSuccess = true;
  }

  generateLink() {
    this.linkSuccess = false;
    this.code = Math.floor(Math.random() * Math.floor(100));
    this.generatedLink = window.location.hostname + ':' + window.location.port + '/arena/' + this.code;
  }
  navigateToArena() {
    this.router.navigate(['arena', this.code], { relativeTo: this.activatedRoute });
    // console.log(this.activatedRoute);
  }

}
