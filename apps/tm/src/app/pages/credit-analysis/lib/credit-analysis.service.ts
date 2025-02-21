import { Injectable } from '@angular/core';
import { CreditAnalysis } from '../model/credit-analysis.model';
import { delay, Observable, of } from 'rxjs';

const DELAY = 2000;

@Injectable({
  providedIn: 'root',
})
export class CreditAnalysisService {
  private mockAnalyses: CreditAnalysis[] = [
    {
      id: '1',
      requestDate: new Date(2024, 1, 15),
      status: 'APPROVED',
      finishDate: new Date(2024, 1, 20),
      approvedAmount: 150000,
    },
    {
      id: '2',
      requestDate: new Date(2024, 1, 25),
      status: 'REJECTED',
      finishDate: new Date(2024, 1, 28),
      rejectionReason: 'Score de crédito insuficiente.',
    },
    {
      id: '3',
      requestDate: new Date(2024, 2, 10),
      status: 'PENDING',
    },
  ];

  getAnalyses(): Observable<CreditAnalysis[]> {
    return of(this.mockAnalyses).pipe(delay(DELAY));
  }

  requestNewAnalysis(): Observable<CreditAnalysis> {
    const newAnalysis: CreditAnalysis = {
      id: Date.now().toString(),
      requestDate: new Date(),
      status: 'PENDING',
    };

    this.mockAnalyses.push(newAnalysis);
    return of(newAnalysis).pipe(delay(DELAY));
  }
}
