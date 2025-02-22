import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StoreService } from '../store/store.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockStoreService: jest.Mocked<StoreService>;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    hasCompletedOnboarding: false
  };

  const mockLoginResponse = {
    access_token: 'mock-token',
    user: mockUser
  };

  beforeEach(() => {
    mockStoreService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    } as unknown as jest.Mocked<StoreService>;

    mockHttpClient = {
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StoreService, useValue: mockStoreService },
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      mockStoreService.getItem.mockReturnValue('mock-token');
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false when access token does not exist', () => {
      mockStoreService.getItem.mockReturnValue(null);
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should login successfully and store data', () => {
      mockHttpClient.post.mockReturnValue(of(mockLoginResponse));

      service.login('testuser', 'password').subscribe(() => {
        expect(mockStoreService.setItem).toHaveBeenCalledWith('access_token', 'mock-token');
        expect(mockStoreService.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      });
    });
  });

  describe('getUser', () => {
    it('should return stored user data', () => {
      mockStoreService.getItem.mockReturnValue(JSON.stringify(mockUser));
      expect(service.getUser()).toEqual(mockUser);
    });

    it('should return empty object when no user is stored', () => {
      mockStoreService.getItem.mockReturnValue(null);
      expect(service.getUser()).toEqual({});
    });
  });

  describe('register', () => {
    it('should register a new user', () => {
      mockHttpClient.post.mockReturnValue(of(mockUser));

      service.register({
        username: 'newuser',
        name: 'New User',
        password: 'password'
      }).subscribe(response => {
        expect(response).toEqual(mockUser);
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('auth/register', {
        username: 'newuser',
        name: 'New User',
        password: 'password'
      });
    });
  });

  describe('onboarding', () => {
    it('should check if user has completed onboarding', () => {
      mockStoreService.getItem.mockReturnValue(JSON.stringify(mockUser));
      expect(service.getHasCompletedOnboarding()).toBeFalsy();
    });

    it('should mark onboarding as completed', () => {
      mockStoreService.getItem.mockReturnValue(JSON.stringify(mockUser));
      service.setOnboardingCompleted();

      const updatedUser = { ...mockUser, hasCompletedOnboarding: true };
      expect(mockStoreService.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
    });
  });

  describe('logout', () => {
    it('should remove stored data when logging out', () => {
      service.logout();
      expect(mockStoreService.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockStoreService.removeItem).toHaveBeenCalledWith('user');
    });
  });
});
