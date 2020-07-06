import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArenaComponent } from './arena/arena.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';



const routes:Routes = [
  {path :'arena/:code', component:ArenaComponent},
  {path : '' , component : HomePageComponent},
  {path : 'home' , component : HomePageComponent}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
