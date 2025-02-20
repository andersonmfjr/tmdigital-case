import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/lib/auth/auth.service';

export const onboardingGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.getHasCompletedOnboarding()) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};