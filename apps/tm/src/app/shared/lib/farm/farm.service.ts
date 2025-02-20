import { inject, Injectable } from '@angular/core';
import { Farm } from '../../model/farm.model';
import { Observable, of, delay } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const DELAY = 3000;

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private readonly STORAGE_KEY = 'farms';

  authService = inject(AuthService);

  getCurrentFarm(): Observable<Farm> {
    const farms = this.getFarms();
    const currentUserId = this.getCurrentUserId();

    const farm = farms.find((farm) => farm.userId === currentUserId) as Farm;

    return of(farm).pipe(delay(DELAY));
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