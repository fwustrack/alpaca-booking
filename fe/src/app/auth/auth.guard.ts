import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isTokenValid()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
