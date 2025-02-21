import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/lib/auth/auth.service';
import { AuthContainerComponent } from '../auth-container/auth-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink, AuthContainerComponent],
  templateUrl: './login.component.html',
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

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { username, password } = this.loginForm.value;
      this.authService.login(username as string, password as string).subscribe({
        next: (response) => {
          if (response.user.hasCompletedOnboarding) {
            this.router.navigateByUrl('/credit-analysis');
            return;
          }

          this.router.navigateByUrl('/onboarding');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao fazer login:', error);
        },
        complete: () => this.isLoading = false
      });
    }
  }

  getEmailError(): string | undefined {
    const control = this.loginForm.get('username');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'O e-mail é obrigatório';
      if (control.errors['email']) return 'O e-mail está inválido';
    }

    return undefined;
  }

  getPasswordError(): string | undefined {
    const control = this.loginForm.get('password');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'A senha é obrigatória';
    }

    return undefined;
  }
}
