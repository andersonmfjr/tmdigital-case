import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { OnboardingService } from '../lib/onboarding/onboarding.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
  animations: [
    trigger('containerAnimation', [
      transition(':enter', [
        style({
          transform: 'translateY(20px)',
          opacity: 0,
        }),
        animate(
          '0.4s ease-out',
          style({
            transform: 'translateY(0)',
            opacity: 1,
          })
        ),
      ]),
    ]),

    trigger('titleAnimation', [
      transition(':enter', [
        style({
          transform: 'translateY(-20px)',
          opacity: 0,
        }),
        animate(
          '0.6s cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'translateY(0)',
            opacity: 1,
          })
        ),
      ]),
    ]),

    trigger('formFields', [
      transition(':enter', [
        query(
          'app-input',
          [
            style({
              opacity: 0,
              transform: 'translateX(-30px)',
            }),
            stagger(100, [
              animate(
                '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
                keyframes([
                  style({
                    opacity: 0,
                    transform: 'translateX(-30px)',
                    offset: 0,
                  }),
                  style({
                    opacity: 0.5,
                    transform: 'translateX(10px)',
                    offset: 0.7,
                  }),
                  style({
                    opacity: 1,
                    transform: 'translateX(0)',
                    offset: 1,
                  }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),

    trigger('buttonAnimation', [
      transition(':enter', [
        style({
          transform: 'scale(0.8)',
          opacity: 0,
        }),
        animate(
          '0.3s 0.6s cubic-bezier(0.35, 0, 0.25, 1)',
          style({
            transform: 'scale(1)',
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class OnboardingComponent {
  onboardingForm = new FormGroup({
    propertyName: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    sector: new FormControl('', [Validators.required]),
    creditReason: new FormControl('', [Validators.required]),
  });

  isLoading = false;

  router = inject(Router);
  onboardingService = inject(OnboardingService);

  async onSubmit() {
    if (this.onboardingForm.valid) {
      this.isLoading = true;

      this.onboardingService
        .saveFarm({
          propertyName: this.onboardingForm.get('propertyName')
            ?.value as string,
          location: this.onboardingForm.get('location')?.value as string,
          sector: this.onboardingForm.get('sector')?.value as string,
          creditReason: this.onboardingForm.get('creditReason')
            ?.value as string,
        })
        .subscribe({
          next: () => this.router.navigateByUrl('/credit-analysis'),
          error: (error) => {
            this.isLoading = false;
            console.error('Erro ao fazer onboarding:', error);
          },
        });
    }
  }

  getPropertyNameError(): string | undefined {
    const control = this.onboardingForm.get('propertyName');

    if (control?.errors && control.touched) {
      if (control.errors['required'])
        return 'O nome da propriedade é obrigatório';
    }

    return undefined;
  }

  getLocationError(): string | undefined {
    const control = this.onboardingForm.get('location');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'A localização é obrigatória';
    }

    return undefined;
  }

  getSectorError(): string | undefined {
    const control = this.onboardingForm.get('sector');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'O setor é obrigatório';
    }

    return undefined;
  }

  getCreditReasonError(): string | undefined {
    const control = this.onboardingForm.get('creditReason');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'A razão do crédito é obrigatória';
    }

    return undefined;
  }
}
