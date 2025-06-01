// fe/src/app/auth/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          return authService.refreshToken(refresh).pipe(
            switchMap((res: any) => {
              const newToken = res?.access;
              if (newToken) {
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                });
                return next(newReq);
              }
              return throwError(() => error);
            }),
            catchError(() => throwError(() => error)),
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
