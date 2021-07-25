import { ElementRef } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class ElementRefPlayer {
  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  get clientX() {
    return this.elementRef.nativeElement.x + 0;
  }

  get clientY() {
    return this.elementRef.nativeElement.y + 0;
  }

  set distanceX(distanceX: string) {
    this.elementRef.nativeElement.style.setProperty(
      "--distanceX",
      `${distanceX}px`
    );
  }
  get distanceX() {
    return this.elementRef.nativeElement.style.getPropertyValue("--distanceX");
  }
  set distanceY(distanceY: string) {
    this.elementRef.nativeElement.style.setProperty(
      "--distanceY",
      `${distanceY}px`
    );
  }
  get distanceY() {
    return this.elementRef.nativeElement.style.getPropertyValue("--distanceY");
  }

  get style() {
    return this.elementRef.nativeElement.style;
  }

  calDistance(client: number, target: number) {
    return target - client;
  }

  onElementClick() {
    return fromEvent(this.elementRef.nativeElement, "click").pipe(
      this.preventDefault()
    );
  }

  onElementMouseDown() {
    return fromEvent(this.elementRef.nativeElement, "mousedown").pipe(
      this.preventDefault()
    );
  }

  preventDefault<T extends Event>() {
    return (source: Observable<T>) =>
      source.pipe(
        tap((e) => {
          e.preventDefault();
          e.stopPropagation();
        })
      );
  }

  updateDistance(mouseX: number, mouseY: number) {
    this.distanceX = String(this.calDistance(this.clientX, mouseX));
    this.distanceY = String(this.calDistance(this.clientY, mouseY));
  }
}
