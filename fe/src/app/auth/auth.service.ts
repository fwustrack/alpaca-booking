// fe/src/app/auth/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, filter, finalize, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8000/api/token/';
  private refreshInProgress = false;
  private refreshSubject = new Subject<string>();

  private isAuthenticatedState = signal<boolean>(this.isTokenValid());
  public readonly isAuthenticated = this.isAuthenticatedState.asReadonly();

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.access) {
          localStorage.setItem('access_token', res.access);
          this.isAuthenticatedState.set(true);
        }
        if (res && res.refresh) {
          localStorage.setItem('refresh_token', res.refresh);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedState.set(false);
    this.router.navigate(['/']);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  }

  refreshToken(refresh: string): Observable<any> {
    if (this.refreshInProgress) {
      // Warte auf das nächste neue Token
      return this.refreshSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap((token) => {
          localStorage.setItem('access_token', token);
          return new Observable((obs) => {
            obs.next({ access: token });
            obs.complete();
          });
        }),
      );
    } else {
      this.refreshInProgress = true;
      return this.http.post(`${this.apiUrl}refresh/`, { refresh }).pipe(
        tap((res: any) => {
          if (res && res.access) {
            localStorage.setItem('access_token', res.access);
            this.refreshSubject.next(res.access);
          } else {
            this.refreshSubject.next('');
          }
        }),
        finalize(() => {
          this.refreshInProgress = false;
        }),
      );
    }
  }
}
