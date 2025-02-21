import { inject, Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { LoginResponse } from '../../model/auth.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Farm } from '../../model/farm.model';

const DELAY = 3000;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';
  private readonly REGISTERED_KEY = 'registered';
  private readonly FARMS_KEY = 'farms';

  storageService = inject(StoreService);

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUser(): LoginResponse['user'] {
    const user = JSON.parse(this.storageService.getItem(this.USER_KEY) || '{}');
    return user;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const currentUsers =
      this.storageService.getItem(this.REGISTERED_KEY) || '[]';
    const users = JSON.parse(currentUsers);

    const user = users.find(
      (user: { username: string; password: string }) =>
        user.username === username && user.password === password
    );

    if (!user) {
      return throwError(() => new Error('Verifique as credenciais informadas'));
    }

    const farms = this.storageService.getItem(this.FARMS_KEY) || '[]';
    const farmsData = JSON.parse(farms);

    const farm = farmsData.find((farm: Farm) => farm.userId === user.id);

    const mockResponse: LoginResponse = {
      access_token: 'mock_token_' + Date.now(),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        hasCompletedOnboarding: farm ? true : false,
      },
    };

    this.storageService.setItem(
      this.ACCESS_TOKEN_KEY,
      mockResponse.access_token
    );
    this.storageService.setItem(
      this.USER_KEY,
      JSON.stringify(mockResponse.user)
    );

    return of(mockResponse).pipe(delay(DELAY));
  }

  register({
    username,
    name,
    password,
  }: {
    username: string;
    name: string;
    password: string;
  }): Observable<boolean> {
    const currentUsers =
      this.storageService.getItem(this.REGISTERED_KEY) || '[]';
    const users = JSON.parse(currentUsers);

    if (
      users.some((user: { username: string }) => user.username === username)
    ) {
      return throwError(() => new Error('Usuário já cadastrado'));
    }

    users.push({
      username,
      name,
      password,
      id: 'mock_id_' + (users.length + 1),
    });
    this.storageService.setItem(this.REGISTERED_KEY, JSON.stringify(users));

    return of(true).pipe(delay(DELAY));
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
