import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ICON_CONFIG } from '../../config/icon.config';

@Component({
  selector: 'app-tours-events',
  imports: [FaIconComponent, RouterModule],
  templateUrl: './tours-events.component.html',
  styleUrl: './tours-events.component.scss',
})
export class ToursEventsComponent {
  readonly icons = ICON_CONFIG.icons;
}
