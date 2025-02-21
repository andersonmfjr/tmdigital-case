import { inject, Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { LoginResponse } from '../../model/auth.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  storageService = inject(StoreService);
  http = inject(HttpClient);

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUser(): LoginResponse['user'] {
    const user = JSON.parse(this.storageService.getItem(this.USER_KEY) || '{}');
    return user;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('auth/login', { username, password })
      .pipe(
        tap((response) => {
          this.storageService.setItem(
            this.ACCESS_TOKEN_KEY,
            response.access_token
          );

          this.storageService.setItem(
            this.USER_KEY,
            JSON.stringify(response.user)
          );
        })
      );
  }

  register({
    username,
    name,
    password,
  }: {
    username: string;
    name: string;
    password: string;
  }): Observable<LoginResponse['user']> {
    return this.http.post<LoginResponse['user']>('auth/register', {
      username,
      name,
      password,
    });
  }

  getHasCompletedOnboarding(): boolean {
    const user = JSON.parse(this.storageService.getItem(this.USER_KEY) || '{}');
    return user.hasCompletedOnboarding;
  }

  setOnboardingCompleted(): void {
    const user = JSON.parse(this.storageService.getItem(this.USER_KEY) || '{}');
    user.hasCompletedOnboarding = true;
    this.storageService.setItem(this.USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);
  }

  getAccessToken(): string | null {
    return this.storageService.getItem(this.ACCESS_TOKEN_KEY);
  }
}
