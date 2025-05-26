import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../components/login/login.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, LoginComponent],
  template: `
    <div class="login-page-container">
      <app-login></app-login>
    </div>
  `,
})
export class LoginPage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/']);
    }
  }
}
