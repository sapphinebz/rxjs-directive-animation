import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import {
  fromEvent,
  Observable,
  pipe,
  partition,
  merge,
  Subscription,
  animationFrameScheduler,
} from "rxjs";
import { observeOn, share, switchMap, takeUntil, tap } from "rxjs/operators";

@Directive({
  selector: "[appScaleing]",
})
export class ScaleingDirective implements OnInit, OnDestroy {
  subscription = new Subscription();

  @Input() step = 0.1;
  @Input() scale = 1;

  set scaleVar(scale: string) {
    this.elementRef.nativeElement.style.setProperty("--scale", scale);
  }

  constructor(public elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    this.scaleVar = String(1);
    const mousedown$ = fromEvent(
      this.elementRef.nativeElement,
      "mousedown"
    ).pipe(tap((e) => e.preventDefault()));

    const mousewheel$ = fromEvent(document, "mousewheel", {
      passive: true,
    }).pipe(share());

    const mouseup$ = fromEvent(document, "mouseup").pipe(
      tap((e) => e.preventDefault())
    );

    const scrubWheelEvent$ = mousedown$.pipe(
      switchMap((_) => mousewheel$.pipe(takeUntil(mouseup$)))
    ) as Observable<WheelEvent>;

    const [wheelup$, wheeldown$] = partition(
      scrubWheelEvent$,
      (e) => e.deltaY > 0
    );

    const scaleDown$ = wheeldown$.pipe(tap((_) => (this.scale -= this.step)));
    const scaleUp$ = wheelup$.pipe(tap((_) => (this.scale += this.step)));

    merge(scaleDown$, scaleUp$)
      .pipe(observeOn(animationFrameScheduler))
      .subscribe((_) => {
        this.scaleVar = String(this.scale);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
