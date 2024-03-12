import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.css']
})
export class TopScreenComponent implements OnInit {
  @Input() playerNumber: number;
  @Input() isPlayerTurn:number;
  constructor() { }

  ngOnInit() {
  }

}
