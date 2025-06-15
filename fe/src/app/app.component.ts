import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { HeaderComponent } from './components/header/header.component';
import { ICON_CONFIG } from './config/icon.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MenubarModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly icons = ICON_CONFIG.icons;
}
