import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
    '[class.is-homepage]': 'isHomepage()',
  },
})
export class HeaderComponent {
  private scrollService = inject(ScrollService);
  private authService = inject(AuthService);

  readonly icons = ICON_CONFIG.icons;
  readonly isAuthenticated = this.authService.isAuthenticated;

  isHomepage = input.required<boolean>();
  isScrolled = this.scrollService.isScrolled;

  onLogout(): void {
    this.authService.logout();
  }
}
