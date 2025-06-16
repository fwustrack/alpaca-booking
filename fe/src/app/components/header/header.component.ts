import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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

  readonly icons = ICON_CONFIG.icons;

  isHomepage = input.required<boolean>();
  isScrolled = this.scrollService.isScrolled;
}
