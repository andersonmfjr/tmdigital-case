import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CreditAnalysisService } from '../lib/credit-analysis.service';
import { CreditAnalysis } from '../model/credit-analysis.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { OnboardingService } from '../../onboarding/lib/onboarding/onboarding.service';
import { FarmService } from '../../../shared/lib/farm/farm.service';

@Component({
  selector: 'app-credit-analysis',
  imports: [CommonModule, ButtonComponent, NgIcon, DatePipe],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  viewProviders: [provideIcons({ lucideChevronDown })],
  templateUrl: './credit-analysis.component.html',
  styleUrl: './credit-analysis.component.css',
})
export class CreditAnalysisComponent implements OnInit {
  analyses: CreditAnalysis[] = [];
  isRequesting = false;
  isLoading = false;
  expandedItems: { [key: string]: boolean } = {};

  farmName = '';

  farmService = inject(FarmService);
  constructor(private creditAnalysisService: CreditAnalysisService) { }

  ngOnInit() {
    this.isLoading = true;

    this.creditAnalysisService.getAnalyses().subscribe({
      next: (analyses) => this.analyses = [ ...analyses ],
      error: (error) => { this.isLoading = false; console.error(error) },
      complete: () => this.isLoading = false,
    });

    this.farmService.getCurrentFarm().subscribe({
      next: (farm) => this.farmName = farm.propertyName,
    });
  }

  toggleExpansion(analysis: CreditAnalysis) {
    if (analysis && analysis.status !== 'PENDING') {
      this.expandedItems[analysis.id] = !this.expandedItems[analysis.id];
    }
  }

  getAnalysisCss(analysis: CreditAnalysis) {
    const classes = 'w-full px-4 py-3 flex items-center justify-between transition-colors'

    if (analysis && analysis.status !== 'PENDING') {
      return classes.concat(' hover:bg-gray-50');
    }

    if (analysis && analysis.status === 'PENDING') {
      return classes.concat(' cursor-not-allowed');
    }

    return classes;
  }

  getStatusText(status: CreditAnalysis['status']): string {
    const statusMap = {
      'PENDING': 'Em análise',
      'APPROVED': 'Aprovado',
      'REJECTED': 'Reprovado'
    };

    return statusMap[status];
  }

  getStatusClass(status: CreditAnalysis['status']): string {
    const classMap = {
      'PENDING': 'bg-yellow-400',
      'APPROVED': 'bg-green-400',
      'REJECTED': 'bg-red-400'
    };
    return classMap[status];
  }

  requestNewAnalysis() {
    this.isRequesting = true;

    this.creditAnalysisService.requestNewAnalysis().subscribe({
      next: (newAnalysis) => this.analyses = [ newAnalysis, ...this.analyses ],
      error: (error) => { 
        this.isRequesting = false;
        console.error(error)
      },
      complete: () => this.isRequesting = false,
    });
  }
}
