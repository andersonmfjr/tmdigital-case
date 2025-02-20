import { Route } from '@angular/router';
import { LoginComponent } from '../pages/auth/ui/login/login.component';
import { RegisterComponent } from '../pages/auth/ui/register/register.component';

export const appRoutes: Route[] = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
