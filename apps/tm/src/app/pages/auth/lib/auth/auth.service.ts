import { Injectable, signal } from '@angular/core';
import { StoreService } from '../../../../shared/lib/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private isAuthenticatedSignal = signal<boolean>(false);

  constructor(private storageService: StoreService) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.storageService.getItem(this.ACCESS_TOKEN_KEY);
    this.isAuthenticatedSignal.set(!!token);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  login(token: string): void {
    this.storageService.setItem(this.ACCESS_TOKEN_KEY, token);
    this.isAuthenticatedSignal.set(true);
  }

  logout(): void {
    this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
    this.isAuthenticatedSignal.set(false);
  }

  getAccessToken(): string | null {
    return this.storageService.getItem(this.ACCESS_TOKEN_KEY);
  }
}
