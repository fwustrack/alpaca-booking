import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {LoginComponent} from '../components/login/login.component';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, LoginComponent],
  template: `
    <div class="login-page-container">
      <h1>Willkommen</h1>
      <app-login></app-login>
    </div>
  `,
})
export class LoginPage {}
