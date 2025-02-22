import { TestBed } from '@angular/core/testing';
import { OnboardingService } from './onboarding.service';
import { AuthService } from '../../../shared/lib/auth/auth.service';
import { FarmService } from '../../../shared/lib/farm/farm.service';
import { of, throwError } from 'rxjs';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockFarmService: jest.Mocked<FarmService>;
  let mockLocalStorage: jest.SpyInstance;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    hasCompletedOnboarding: false
  };

  const mockFarmData = {
    propertyName: 'Test Farm',
    location: 'Test Location',
    sector: 'Test Sector',
    creditReason: 'Test Credit Reason'
  };

  const mockSavedFarm = {
    id: 1,
    userId: 1,
    ...mockFarmData
  };

  beforeEach(() => {
    mockAuthService = {
      getUser: jest.fn().mockReturnValue(mockUser)
    } as unknown as jest.Mocked<AuthService>;

    mockFarmService = {
      saveFarm: jest.fn().mockReturnValue(of(mockSavedFarm))
    } as unknown as jest.Mocked<FarmService>;

    mockLocalStorage = jest.spyOn(Storage.prototype, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        OnboardingService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: FarmService, useValue: mockFarmService }
      ]
    });

    service = TestBed.inject(OnboardingService);
  });

  afterEach(() => {
    mockLocalStorage.mockRestore();
  });

  describe('saveFarm', () => {
    it('should save farm data and update user onboarding status', (done) => {
      service.saveFarm(mockFarmData).subscribe({
        next: (savedFarm) => {
          expect(mockFarmService.saveFarm).toHaveBeenCalledWith(mockFarmData);
          expect(savedFarm).toEqual(mockSavedFarm);

          expect(mockAuthService.getUser).toHaveBeenCalled();

          const expectedUser = { ...mockUser, hasCompletedOnboarding: true };
          expect(mockLocalStorage).toHaveBeenCalledWith(
            'user',
            JSON.stringify(expectedUser)
          );

          done();
        },
        error: done
      });
    });

    it('should handle errors from farm service', (done) => {
      const errorMessage = 'Failed to save farm';
      mockFarmService.saveFarm = jest.fn().mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      service.saveFarm(mockFarmData).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          expect(mockLocalStorage).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should not update localStorage if getUser fails', (done) => {
      mockAuthService.getUser = jest.fn().mockImplementation(() => {
        throw new Error('Failed to get user');
      });

      service.saveFarm(mockFarmData).subscribe({
        error: () => {
          expect(mockLocalStorage).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
