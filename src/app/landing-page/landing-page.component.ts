import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { DataCommunicationService } from '../services/data-communication.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
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
