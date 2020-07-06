import { Component, OnInit, ViewChild, ElementRef,  ViewChildren, } from '@angular/core';
import { DataCommunicationService } from '../services/data-communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { GsapAnimationService } from '../gsap-animation.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  linkSuccess: boolean;
  generatedLink: string;
  code: number;
  isCardSelected:boolean = false;
  selectedCard: string;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private socketService:SocketService,
    private dataCommService:DataCommunicationService,
    private gsapAnimation : GsapAnimationService,
  ) { 
  }

  ngOnInit() {
    this.linkSuccess = true;
    
  }

  ngAfterViewInit(){
    
  }

  ngOnChanges(){
    
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

  selectCard(selectedCard){
    this.isCardSelected = true;
    this.selectedCard = selectedCard; 
    
    
  }

  copyLink(event) {
    /* Get the text field */
    var copyText = document.getElementsByName("inputLink")[0] as HTMLInputElement;
    copyText.select();
    document.execCommand("copy");
  }
}
