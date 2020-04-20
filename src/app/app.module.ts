import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomePageComponent } from './home-page/home-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';

import { MatCardModule } from  '@angular/material/card';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ArenaComponent } from './arena/arena.component'
import { DataCommunicationService } from './services/data-communication.service';
import { SocketService } from './services/socket.service';



// const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

// const routes:Routes = [
//  {path :'arena/:code', component:ArenaComponent},
 
// ];
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomePageComponent,
    ArenaComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
    // SocketIoModule.forRoot(config),
    FormsModule,
    // RouterModule.forRoot(routes)
  ],
  providers: [
    DataCommunicationService,
    SocketService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
