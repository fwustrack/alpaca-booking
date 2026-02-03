import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  private messageService = inject(MessageService);

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
      this.messageService.add({
        severity: 'warn',
        summary: 'Ungültige Eingabe',
        detail: 'Bitte füllen Sie alle Felder korrekt aus.',
        life: 5000,
      });
      return;
    }

    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Fehlende Eingaben',
        detail: 'Benutzername und Passwort sind erforderlich.',
        life: 5000,
      });
      return;
    }

    this.isLoading = true;

    this.authService
      .login(username, password)
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Anmeldung fehlgeschlagen',
            detail: 'Benutzername oder Passwort ist falsch. Bitte versuchen Sie es erneut.',
            life: 5000,
          });
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Anmeldung erfolgreich',
          life: 5000,
        });

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1000);
      });
  }
}
