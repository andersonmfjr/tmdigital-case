import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form submitted', this.registerForm.value);
    }
  }

  get currentYear() {
    return new Date().getFullYear();
  }
}
