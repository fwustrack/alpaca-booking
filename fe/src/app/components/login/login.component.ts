import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [PasswordModule, ReactiveFormsModule, InputTextModule, IftaLabelModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); // AuthService injizieren
  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });

  onSubmit() {
    console.log('LoginComponent.onSubmit');
    const { username, password } = this.loginForm.value;
    if (!username || !password) {
      alert('Bitte E-Mail und Passwort eingeben');
      return;
    }
    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Login fehlgeschlagen');
      },
    });
  }
}
