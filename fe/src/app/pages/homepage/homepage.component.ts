import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ICON_CONFIG } from '../../config/icon.config';

@Component({
  selector: 'app-homepage',
  imports: [FaIconComponent, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  readonly icons = ICON_CONFIG.icons;
}
