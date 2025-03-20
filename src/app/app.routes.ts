import { Routes } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { ServicesPageComponent } from './pages/services/services.page';
import { ImportersPageComponent } from './pages/importers/importers.page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  },
  {
    path: 'services',
    component: ServicesPageComponent
  },
  {
    path: 'importers',
    component: ImportersPageComponent
  }
];
