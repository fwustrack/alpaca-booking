// fe/src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject, filter, switchMap, take, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/token/';
  private refreshInProgress = false;
  private refreshSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.access) {
          localStorage.setItem('access_token', res.access);
        }
        if (res && res.refresh) {
          localStorage.setItem('refresh_token', res.refresh);
        }
      })
    );
  }

  refreshToken(refresh: string): Observable<any> {
    if (this.refreshInProgress) {
      // Warte auf das nächste neue Token
      return this.refreshSubject.pipe(
        filter(token => !!token),
        take(1),
        switchMap(token => {
          localStorage.setItem('access_token', token);
          return new Observable(obs => {
            obs.next({ access: token });
            obs.complete();
          });
        })
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
        })
      );
    }
  }
}
