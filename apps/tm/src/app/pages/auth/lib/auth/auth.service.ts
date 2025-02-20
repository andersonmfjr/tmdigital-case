import { Injectable, signal } from '@angular/core';
import { StoreService } from '../../../../shared/lib/store/store.service';
import { LoginResponse } from '../../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  private isAuthenticatedSignal = signal<boolean>(false);
  private hasCompletedOnboardingSignal = signal<boolean>(false);

  constructor(private storageService: StoreService) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.getAccessToken();
    this.isAuthenticatedSignal.set(!!token);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResponse: LoginResponse = {
      access_token: 'mock_token_' + Date.now(),
      user: {
        id: '1',
        email,
        hasCompletedOnboarding: false
      }
    };

    this.storageService.setItem(this.ACCESS_TOKEN_KEY, mockResponse.access_token);
    this.storageService.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
    
    this.isAuthenticatedSignal.set(true);
    this.hasCompletedOnboardingSignal.set(mockResponse.user.hasCompletedOnboarding);

    return mockResponse;
  }

  getHasCompletedOnboarding(): boolean {
    return this.hasCompletedOnboardingSignal();
  }

  setOnboardingCompleted(): void {
    const user = JSON.parse(this.storageService.getItem(this.USER_KEY) || '{}');
    user.hasCompletedOnboarding = true;
    this.storageService.setItem(this.USER_KEY, JSON.stringify(user));
    this.hasCompletedOnboardingSignal.set(true);
  }

  logout(): void {
    this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
    this.isAuthenticatedSignal.set(false);
  }

  getAccessToken(): string | null {
    return this.storageService.getItem(this.ACCESS_TOKEN_KEY);
  }
}
