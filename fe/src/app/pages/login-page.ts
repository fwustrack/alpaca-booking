import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../components/login/login.component';

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
    private authService: AuthService,
  ) {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/']);
    }
  }
}
