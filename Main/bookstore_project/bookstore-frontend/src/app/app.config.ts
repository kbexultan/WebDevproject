import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './service/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // // FE-6: Конфигурация маршрутизации приложения с использованием определенных маршрутов.
    provideRouter(routes),
    // // FE-8a: Подключение и регистрация AuthInterceptor для обработки HTTP запросов.
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
  ],
};