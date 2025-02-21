/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jest.Mocked<Router>;
  let authService: jest.Mocked<AuthService>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    router = {
      createUrlTree: jest.fn(),
    } as any;

    authService = {
      isAuthenticated: jest.fn(),
      getHasCompletedOnboarding: jest.fn(),
    } as any;

    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = {
      url: '',
    } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  const runGuard = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    return TestBed.runInInjectionContext(() => authGuard(route, state));
  };

  it('should redirect authenticated user from onboarding to credit-analysis when onboarding is completed', () => {
    stateSnapshot.url = '/onboarding';
    authService.isAuthenticated.mockReturnValue(true);
    authService.getHasCompletedOnboarding.mockReturnValue(true);
    router.createUrlTree.mockReturnValue({
      toString: () => '/credit-analysis',
    } as any);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/credit-analysis']);
    expect(result.toString()).toEqual('/credit-analysis');
  });

  it('should redirect authenticated user from credit-analysis to onboarding when onboarding is not completed', () => {
    stateSnapshot.url = '/credit-analysis';
    authService.isAuthenticated.mockReturnValue(true);
    authService.getHasCompletedOnboarding.mockReturnValue(false);
    router.createUrlTree.mockReturnValue({
      toString: () => '/onboarding',
    } as any);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/onboarding']);
    expect(result.toString()).toEqual('/onboarding');
  });

  it('should redirect unauthenticated user to login page when accessing protected route', () => {
    stateSnapshot.url = '/protected-route';
    authService.isAuthenticated.mockReturnValue(false);
    router.createUrlTree.mockReturnValue({
      toString: () => '/auth/login',
    } as any);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result.toString()).toEqual('/auth/login');
  });

  it('should allow unauthenticated user to access auth routes', () => {
    stateSnapshot.url = '/auth/login';
    authService.isAuthenticated.mockReturnValue(false);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(true);
  });

  it('should redirect authenticated user from login to credit-analysis when onboarding is completed', () => {
    stateSnapshot.url = '/auth/login';
    authService.isAuthenticated.mockReturnValue(true);
    authService.getHasCompletedOnboarding.mockReturnValue(true);
    router.createUrlTree.mockReturnValue({
      toString: () => '/credit-analysis',
    } as any);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/credit-analysis']);
    expect(result.toString()).toEqual('/credit-analysis');
  });

  it('should redirect authenticated user from login to onboarding when onboarding is not completed', () => {
    stateSnapshot.url = '/auth/login';
    authService.isAuthenticated.mockReturnValue(true);
    authService.getHasCompletedOnboarding.mockReturnValue(false);
    router.createUrlTree.mockReturnValue({
      toString: () => '/onboarding',
    } as any);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/onboarding']);
    expect(result.toString()).toEqual('/onboarding');
  });

  it('should allow authenticated user to access protected routes when onboarding is completed', () => {
    stateSnapshot.url = '/protected-route';
    authService.isAuthenticated.mockReturnValue(true);
    authService.getHasCompletedOnboarding.mockReturnValue(true);

    const result = runGuard(routeSnapshot, stateSnapshot);

    expect(result).toBe(true);
  });
});
