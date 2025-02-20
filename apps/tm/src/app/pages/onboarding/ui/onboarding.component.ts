import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  animate, 
  style, 
  transition, 
  trigger, 
  query, 
  stagger, 
  keyframes 
} from '@angular/animations';

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
          opacity: 0
        }),
        animate('0.4s ease-out', style({ 
          transform: 'translateY(0)', 
          opacity: 1
        }))
      ])
    ]),
    
    trigger('titleAnimation', [
      transition(':enter', [
        style({ 
          transform: 'translateY(-20px)', 
          opacity: 0 
        }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ 
          transform: 'translateY(0)', 
          opacity: 1 
        }))
      ])
    ]),
    
    trigger('formFields', [
      transition(':enter', [
        query('app-input', [
          style({ 
            opacity: 0, 
            transform: 'translateX(-30px)' 
          }),
          stagger(100, [
            animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', keyframes([
              style({ 
                opacity: 0, 
                transform: 'translateX(-30px)', 
                offset: 0 
              }),
              style({ 
                opacity: 0.5, 
                transform: 'translateX(10px)', 
                offset: 0.7 
              }),
              style({ 
                opacity: 1, 
                transform: 'translateX(0)', 
                offset: 1 
              })
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ 
          transform: 'scale(0.8)', 
          opacity: 0 
        }),
        animate('0.3s 0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ 
          transform: 'scale(1)', 
          opacity: 1 
        }))
      ])
    ])
  ]
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

  async onSubmit() {
    if (this.onboardingForm.valid) {
      this.isLoading = true;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 4000));  
  
        await this.router.navigateByUrl('/auth/register');
      } catch (error) {
        console.error('Erro ao fazer onboarding:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
