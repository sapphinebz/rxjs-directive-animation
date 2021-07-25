import { Directive, ElementRef, OnInit } from "@angular/core";
import { animationFrameScheduler, fromEvent, Observable } from "rxjs";
import {
  auditTime,
  observeOn,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { ElementRefPlayer } from "./animations";

@Directive({
  selector: "[appDragDrop]",
})
export class DragDropDirective implements OnInit {
  element = new ElementRefPlayer(this.elementRef);

  constructor(public elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    const mousedown$ = this.element.onElementMouseDown();
    const mousemove$ = fromEvent(document, "mousemove");
    const mouseup$ = fromEvent(document, "mouseup");
    mousedown$
      .pipe(
        switchMap((e) => {
          return mousemove$.pipe(takeUntil(mouseup$));
        }),
        observeOn(animationFrameScheduler)
      )
      .subscribe((event) => {
        const mouseEvent = event as MouseEvent;
        this.element.updateDistance(mouseEvent.x, mouseEvent.y);
      });
  }
}
