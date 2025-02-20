import { Route } from '@angular/router';
import { LoginComponent } from '../pages/auth/ui/login/login.component';
import { RegisterComponent } from '../pages/auth/ui/register/register.component';
import { authGuard } from '../pages/auth/lib/auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard],
      },      
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
