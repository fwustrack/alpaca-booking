import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {PasswordModule} from 'primeng/password';
import { InputTextModule }  from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [PasswordModule,
    ReactiveFormsModule, InputTextModule, IftaLabelModule, ButtonModule
  ],
  templateUrl: './login.component.html',
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
    const {username, password} = this.loginForm.value;
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
      }
    });
  }
}
