import { ViewportScroller } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { ICON_CONFIG } from './config/icon.config';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenubarModule,
    HeaderComponent,
    MobileHeaderComponent,
    FooterComponent,
    ToastModule
],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private scroller = inject(ViewportScroller);
  private router = inject(Router);

  readonly icons = ICON_CONFIG.icons;

  // Routes that have a top image and should use white header background when at top
  private readonly routesWithTopImage = ['/', '/tours-events'];

  pageHasTopImage = signal<boolean>(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const pageHasTopImage = this.routesWithTopImage.includes(event.urlAfterRedirects);
        this.pageHasTopImage.set(pageHasTopImage);
        this.scroller.scrollToPosition([0, 0]);
      });
  }
}
