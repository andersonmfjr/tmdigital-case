import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/lib/auth/auth.service';
import { AuthContainerComponent } from '../auth-container/auth-container.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink, AuthContainerComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [
      Validators.required,
      (control) => {
        if (!control.parent) return null;
        const password = control.parent.get('password');
        return password?.value === control.value ? null : { passwordMismatch: true };
      }
    ]),
  });

  isLoading = false;
  router = inject(Router);
  authService = inject(AuthService);

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const { name, username, password } = this.registerForm.value;

      this.authService.register({ name: name as string, username: username as string, password: password as string }).subscribe({
        next: () => this.router.navigateByUrl('/auth/login'),
        error: (error) => {
          console.error('Erro ao fazer cadastro:', error);
          this.isLoading = false;
        },
      });
    }
  }

  getNameError(): string | undefined {
    const control = this.registerForm.get('name');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'O nome é obrigatório';
    }

    return undefined;
  }

  getEmailError(): string | undefined {
    const control = this.registerForm.get('username');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'O e-mail é obrigatório';
      if (control.errors['email']) return 'O e-mail está inválido';
    }

    return undefined;
  }

  getPasswordError(): string | undefined {
    const control = this.registerForm.get('password');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'A senha é obrigatória';
    }

    return undefined;
  }

  getConfirmPasswordError(): string | undefined {
    const control = this.registerForm.get('confirmPassword');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'A senha é obrigatória';
      if (control.errors['passwordMismatch']) return 'As senhas não coincidem';
    }

    return undefined;
  }
}
