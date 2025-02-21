import { inject, Injectable } from '@angular/core';
import { Farm } from '../../model/farm.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  http = inject(HttpClient);

  getCurrentFarm(): Observable<Farm> {
    return this.http.get<Farm>('farms/my-farm');
  }

  saveFarm(farm: Omit<Farm, 'id' | 'userId'>): Observable<Farm> {
    return this.http.post<Farm>('farms', farm);
  }
}
