import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';
import { GsapAnimationService } from './gsap-animation.service';

@Directive({
  selector: '[appSelectiondCard]'
})
export class SelectiondCardDirective implements OnInit{

  constructor(
    private elementRef:ElementRef,
    private render:Renderer2,
    private gsap:GsapAnimationService
  ) { 
  }

  ngOnInit(){
    this.gsap.showCardSelection(this.elementRef.nativeElement,0.5,'easeIn');
  }
}
