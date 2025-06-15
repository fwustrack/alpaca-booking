import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ICON_CONFIG } from '../../config/icon.config';

@Component({
  selector: 'app-header',
  imports: [FaIconComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly icons = ICON_CONFIG.icons;
}
