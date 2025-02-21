import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../shared/lib/auth/auth.service';
import { Farm } from '../../../shared/model/farm.model';
import { Observable, tap } from 'rxjs';
import { FarmService } from '../../../shared/lib/farm/farm.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly USER_KEY = 'user';

  authService = inject(AuthService);
  farmService = inject(FarmService);

  saveFarm(farmData: Omit<Farm, 'id' | 'userId'>): Observable<Farm> {
    return this.farmService.saveFarm(farmData).pipe(
      tap(() => {
        const user = this.authService.getUser();
        user.hasCompletedOnboarding = true;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }
}
