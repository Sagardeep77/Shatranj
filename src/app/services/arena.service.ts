import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';

export interface Message {
  author: string,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ArenaService {
  
}
