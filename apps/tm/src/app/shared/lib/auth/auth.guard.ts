import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated() && state.url.includes('onboarding') && authService.getHasCompletedOnboarding()) {
    return router.createUrlTree(['/credit-analysis']);
  }

  if (authService.isAuthenticated() && state.url.includes('credit-analysis') && !authService.getHasCompletedOnboarding()) {
    return router.createUrlTree(['/onboarding']);
  }

  if (!authService.isAuthenticated()) {
    if (!state.url.startsWith('/auth/')) {
      return router.createUrlTree(['/auth/login']);
    }

    return true;
  }

  if (state.url.includes('/auth/login') || state.url.includes('/auth/register')) {
    if (authService.getHasCompletedOnboarding()) {
      return router.createUrlTree(['/credit-analysis']);
    }

    return router.createUrlTree(['/onboarding']);
  }

  return true;
};
