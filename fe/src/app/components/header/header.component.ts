import { Component, inject, input, signal, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { ICON_CONFIG } from '../../config/icon.config';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [FaIconComponent, RouterModule],
  host: {
    '[class.header--scrolled]': 'isScrolled()',
    '[class.page-has-top-image]': 'pageHasTopImage()',
  },
})
export class HeaderComponent {
  private scrollService = inject(ScrollService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  readonly icons = ICON_CONFIG.icons;
  readonly isAuthenticated = this.authService.isAuthenticated;

  pageHasTopImage = input.required<boolean>();
  isScrolled = this.scrollService.isScrolled;
  isDropdownOpen = signal(false);

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  onLogout(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Abgemeldet',
      detail: 'Sie wurden erfolgreich abgemeldet.',
      life: 4000,
    });
    this.authService.logout();
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as Element;
    if (!target.closest('.admin-dropdown-container')) {
      this.closeDropdown();
    }
  }
}
