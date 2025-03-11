import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { BsModalService } from 'ngx-bootstrap/modal';

import { routes } from './app.routes';
import { AuthenticationServiceProvider } from './services/auth.service.provider';
import { ConfigService } from './services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //[provideRouter(routes), withDebugTracing()],
    provideHttpClient(),
    provideAnimations(),
    AuthenticationServiceProvider,
    BsModalService,
    ConfigService,
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.loadConfiguredFeatures() as Promise<unknown>;
    })
  ],
};
