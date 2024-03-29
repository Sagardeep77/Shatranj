import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2 } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

//services

import { DataCommunicationService } from './services/data-communication.service';
import { SocketService } from './services/socket.service';

//components
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { ArenaComponent } from './arena/arena.component'

// angular material modules
import { MatSliderModule } from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule } from  '@angular/material/card';
import { ChessPieceComponent } from './chess-piece/chess-piece.component';
import { ArenaService } from './services/arena.service';
import { ChatAppComponent } from './chat-app/chat-app.component';
import { TopScreenComponent } from './top-screen/top-screen.component';
import { SelectiondCardDirective } from './selectiond-card.directive';

// import { ClipboardModule } from '@angular/cdk/clipboard'


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomePageComponent,
    ArenaComponent,
    ChessBoardComponent,
    ChessPieceComponent,
    ChatAppComponent,
    TopScreenComponent,
    SelectiondCardDirective,
    // ClipboardModule
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
    
  ],
  providers: [
    DataCommunicationService,
    SocketService,
    ArenaService,
    
   
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
