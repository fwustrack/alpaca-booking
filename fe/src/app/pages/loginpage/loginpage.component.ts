import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-loginpage',
  imports: [PasswordModule, ReactiveFormsModule, InputTextModule, IftaLabelModule, ButtonModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.scss',
})
export class LoginpageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });

  constructor() {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      alert('Bitte E-Mail und Passwort eingeben');
      return;
    }

    this.authService
      .login(username, password)
      .pipe(
        catchError(() => {
          alert('Login fehlgeschlagen');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
