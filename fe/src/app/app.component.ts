import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { filter } from 'rxjs';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ICON_CONFIG } from './config/icon.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MenubarModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private scroller = inject(ViewportScroller);
  private router = inject(Router);

  readonly icons = ICON_CONFIG.icons;

  isHomepage = signal<boolean>(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isHomepage = event.urlAfterRedirects === '/';
        this.isHomepage.set(isHomepage);
        this.scroller.scrollToPosition([0, 0]);
      });
  }
}
