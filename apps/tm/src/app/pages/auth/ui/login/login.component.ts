import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('formAnimation', [
      transition(':leave', [
        query('.form-control', [
          stagger(100, [
            animate('0.5s ease-out', keyframes([
              style({ 
                opacity: 1, 
                transform: 'translateX(0)',
                offset: 0 
              }),
              style({ 
                opacity: 0.5, 
                transform: 'translateX(30px)',
                offset: 0.3 
              }),
              style({ 
                opacity: 0, 
                transform: 'translateX(-100%)',
                offset: 1 
              })
            ]))
          ])
        ]),
        animate('0.3s ease-out', style({ 
          transform: 'scale(0.8) translateY(-100%)',
          opacity: 0 
        }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = false;

  router = inject(Router);

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        await this.router.navigateByUrl('/auth/register');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  get currentYear() {
    return new Date().getFullYear();
  }
}
