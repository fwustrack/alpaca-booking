import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { catchError, EMPTY, finalize } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-loginpage',
  imports: [
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.scss',
  host: {
    class: 'content-container',
  },
})
export class LoginpageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      return;
    }

    this.isLoading = true;

    this.authService
      .login(username, password)
      .pipe(
        catchError(() => {
          alert('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.');
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }
}
