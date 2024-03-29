import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

import { DataCommunicationService } from "./data-communication.service";
import { Observable } from "rxjs";
import { ChessPiece } from "../models/gameState.model";
// import { environment } from '../environments/environment';

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket;
  message: string;
  constructor(private dataCommService: DataCommunicationService) {}

  async connect(code) {
    const response = await this.dataCommService.checkCode(code);

    // console.log("socketService->",response);
    if (response) {
      this.socket = io(this.dataCommService.webSocketUrl);
      this.emitCode(code);
      return "Connected";
    }
    return "Not Connected";
  }

  emitCode(code) {
    this.socket.emit("emit-code", { code: code });
  }

  activeConnections(): Observable<String> {
    let observable = new Observable<String>((observer) => {
      this.socket.on("on-connect", (data: any) => observer.next(data));
    });
    return observable;
  }

  onMessage(): Observable<String> {
    let observable = new Observable<String>((observer) => {
      this.socket.on("new-message", (data: String) => {
        observer.next(data);
        console.log(data);
      });
    });
    return observable;
  }

  onPlayerLeft(): Observable<String> {
    let observable = new Observable<String>((observer) => {
      this.socket.on("player-left", (data: String) => {
        this.sendMessage("Playewr left");
        return observer.next(data);
      });
    });
    return observable;
  }

  sendMessage(message) {
    this.socket.emit("new-message", message);
  }

  sendDragDropData(data) {
    this.socket.emit("drop-successful", data);
  }

  getOpponentTurn() {
    let observable = new Observable<ChessPiece>((observer) => {
      this.socket.on("opponent-turn", (data: ChessPiece) =>
        observer.next(data)
      );
    });
    return observable;
  }
}
