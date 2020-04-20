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
  doorPinCode="";
  openDoor = false;
  constructor() { }
  ngOnInit() { }

  //funtion to add new digit to lock screen
  buttonClicked(number) {
    this.doorPinCode += number;
    if(this.doorPinCode.length === 4){
      this.checkPin(this.doorPinCode);
    }
  }

  //function to remove last digit
  deleteLastElement() {
    if (this.doorPinCode.length > 0) {
      this.doorPinCode = this.doorPinCode.substring(0, this.doorPinCode.length - 1);
    }
  }

  checkPin(pin){
    if(parseInt(pin)==1234){
      this.openDoor = !this.openDoor
    }
    console.log(pin);
  }

  // turnGreen() {
  //   document.getElementsByClassName('lock-keypad-LED')[0].style.backgroundColor = "green";
  //   document.getElementsByClassName('door')[0].style.transitionDelay = "0.6s";
  //   document.getElementsByClassName('door')[1].style.transitionDelay = "0.6s";
  //   document.getElementsByClassName('left-door')[0].style.transform = "translateX(-100%)";
  //   document.getElementsByClassName('right-door')[0].style.transform = "translateX(100%)";
  // }
}
