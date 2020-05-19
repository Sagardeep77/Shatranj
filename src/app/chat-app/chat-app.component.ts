import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SocketService } from '../services/socket.service';


export interface Message {
  "text": String;
  "sender": String;
}


@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit, OnChanges {
  @Input() connected: boolean;
  sentMessage: String;
  messages = new Array<Message>();
  constructor(private socketService: SocketService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    console.log(this.connected);
    if (this.connected) {
      this.socketService.onMessage().subscribe((data) => {
        // console.log(data);
        let message: Message;
        message = {
          "text": data,
          "sender": 'opponent'
        }
        this.messages.push(message);
      });
    }
  }


  sendMessage(event) {
    if (event === "send") {
      this.socketService.sendMessage(this.sentMessage);
      let message: Message;
      message = {
        "text": this.sentMessage,
        "sender": 'self'
      }
      this.messages.push(message);
      this.sentMessage = '';
    }
    else if (event.keyCode === 13) {
      this.socketService.sendMessage(this.sentMessage);
      let message: Message;
      message = {
        "text": this.sentMessage,
        "sender": 'self'
      }
      this.messages.push(message);
      this.sentMessage = '';
    }
  }
}
