import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, fromEvent, map, startWith, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private destroyRef = inject(DestroyRef);

  private isScrolledState = signal<boolean>(false);
  public readonly isScrolled = this.isScrolledState.asReadonly();

  constructor() {
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(15),
        map(() => window.scrollY),
        map((scrollY) => scrollY > 100),
        startWith(false),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((scrolled) => this.isScrolledState.set(scrolled));
  }
}
