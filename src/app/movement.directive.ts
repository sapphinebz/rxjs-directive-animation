import { Directive, ElementRef, HostBinding, OnInit } from "@angular/core";
import {
  animationFrameScheduler,
  defer,
  EMPTY,
  fromEvent,
  Observable,
} from "rxjs";
import { finalize, observeOn, switchMap, take, tap } from "rxjs/operators";
import { ElementRefPlayer } from "./animations";

@Directive({
  selector: "[appMovement]",
})
export class MovementDirective implements OnInit {
  element = new ElementRefPlayer(this.elementRef);
  constructor(public elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    this.element.style.transitionProperty = "transform";
    this.element.style.transitionDuration = "1000ms";
    this.element.distanceX = String(0);
    this.element.distanceY = String(0);

    this.element
      .onElementClick()
      .pipe(
        switchMap((e) =>
          fromEvent(document, "click").pipe(take(1), this.selectedGrayScale())
        ),
        observeOn(animationFrameScheduler)
      )
      .subscribe((event) => {
        const mouseEvent = event as MouseEvent;
        this.element.updateDistance(mouseEvent.x, mouseEvent.y);
      });
  }

  selectedGrayScale<T>() {
    return (source: Observable<T>) => {
      return defer(() => {
        this.elementRef.nativeElement.style.filter = "grayscale(100%)";
        return source.pipe(
          finalize(() => {
            this.elementRef.nativeElement.style.filter = "grayscale(0)";
          })
        );
      });
    };
  }
}
