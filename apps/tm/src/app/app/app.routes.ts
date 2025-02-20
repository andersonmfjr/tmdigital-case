import { Route } from '@angular/router';
import { LoginComponent } from '../pages/auth/ui/login/login.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
