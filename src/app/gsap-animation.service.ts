import { Injectable } from '@angular/core';
import { TweenMax,TimelineMax,Power2,Power1,gsap } from 'gsap'

@Injectable({
  providedIn: 'root'
})
export class GsapAnimationService {
  chessPieces=[];
  timelineMax = new TimelineMax;
  constructor() { }
  showCardSelection(element,duration,animationType){
    
    this.timelineMax.from(element,duration,{
      opacity:0,
      y:-200,
      ease:Power2.easeIn
    });
  }

  chessBoardAnimation(chessPieces: HTMLCollectionOf<Element>) {
    gsap.to(chessPieces, 1, {
      scale: 0.1, 
      y: -200,
      yoyo: true, 
      repeat: 1, 
      opacity:0,
      ease: Power1.easeInOut,
      delay:1,
      stagger: {
        amount: 1.5, 
        grid: "auto",
        from: "center"
      }
    });
  }
}
