import { Route } from '@angular/router';
import { authGuard } from '../shared/lib/auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../pages/auth/ui/login/login.component').then(
            (m) => m.LoginComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../pages/auth/ui/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('../pages/onboarding/ui/onboarding.component').then(
        (m) => m.OnboardingComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'credit-analysis',
    loadComponent: () =>
      import('../pages/credit-analysis/ui/credit-analysis.component').then(
        (m) => m.CreditAnalysisComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
