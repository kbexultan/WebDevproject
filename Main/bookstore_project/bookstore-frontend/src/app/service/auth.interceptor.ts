import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

// // FE-8a: Определение функции-перехватчика (Interceptor) для обработки HTTP запросов.
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getToken();
  let modifiedReq = req;

  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: {
        // // FE-8a: Добавление JWT токена доступа в заголовок Authorization.
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((response) => {
              const newAccessToken = response.access;
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed', refreshError);
              // // FE-8c: Вызов logout при ошибке обновления токена.
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
           // // FE-8c: Вызов logout при отсутствии refresh токена и ошибке 401.
           authService.logout();
           router.navigate(['/login']);
           return throwError(() => new Error('No refresh token available. User logged out.'));
        }
      }

      return throwError(() => error);
    })
  );
};