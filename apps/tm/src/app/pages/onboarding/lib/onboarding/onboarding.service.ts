import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../../shared/lib/auth/auth.service';
import { Farm } from '../../../../shared/model/farm.model';
import { Observable, of, delay } from 'rxjs';

const DELAY = 3000;

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private readonly STORAGE_KEY = 'farms';
  private readonly USER_KEY = 'user';

  authService = inject(AuthService);

  saveFarm(farmData: Omit<Farm, 'id' | 'userId'>): Observable<Farm> {
    const farms = this.getFarms();
    
    const newFarm: Farm = {
      id: 'mock_id_' + (farms.length + 1),
      userId: this.getCurrentUserId(),
      ...farmData
    };

    const user = this.authService.getUser();
    user.hasCompletedOnboarding = true;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    farms.push(newFarm);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(farms));
    
    return of(newFarm).pipe(delay(DELAY));
  }

  private getFarms(): Farm[] {
    const farmsJson = localStorage.getItem(this.STORAGE_KEY);
    return farmsJson ? JSON.parse(farmsJson) : [];
  }

  private getCurrentUserId(): string {
    const user = this.authService.getUser();
    return user.id;
  }
}
