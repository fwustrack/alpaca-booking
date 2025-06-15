import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-loginpage',
  imports: [LoginComponent],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.scss',
})
export class LoginpageComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/']);
    }
  }
}
