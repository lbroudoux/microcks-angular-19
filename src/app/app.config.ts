import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';

import { routes } from './app.routes';
import { AuthenticationServiceProvider } from './services/auth.service.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    BsModalService,
    AuthenticationServiceProvider
  ]
};
