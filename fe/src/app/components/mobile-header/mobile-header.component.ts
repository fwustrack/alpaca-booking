import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { ICON_CONFIG } from '../../config/icon.config';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
  imports: [FaIconComponent, RouterModule],
  host: {
    '[class.header--scrolled]': 'isScrolled()',
    '[class.page-has-top-image]': 'pageHasTopImage()',
    '[class.menu-open]': 'isMenuOpen()',
  },
})
export class MobileHeaderComponent {
  private scrollService = inject(ScrollService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  readonly icons = ICON_CONFIG.icons;
  readonly isAuthenticated = this.authService.isAuthenticated;

  pageHasTopImage = input.required<boolean>();
  isScrolled = this.scrollService.isScrolled;
  isMenuOpen = signal(false);

  constructor() {
    // Handle body scroll prevention when menu is open
    effect(() => {
      if (this.isMenuOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onLogout(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Abgemeldet',
      detail: 'Sie wurden erfolgreich abgemeldet.',
      life: 4000,
    });
    this.authService.logout();
    this.closeMenu();
  }
}
