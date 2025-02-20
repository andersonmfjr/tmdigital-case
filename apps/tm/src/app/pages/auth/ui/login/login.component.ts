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
import { AuthService } from '../../lib/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = false;

  router = inject(Router);
  authService = inject(AuthService);

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 4000));
        this.authService.login(this.loginForm.value.username as string);

        await this.router.navigateByUrl('/onboarding');
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
