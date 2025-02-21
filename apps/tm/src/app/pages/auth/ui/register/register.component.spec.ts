import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../shared/lib/auth/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { appRoutes } from '../../../../app/app.routes';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        AuthContainerComponent,
      ],
      providers: [
        provideRouter(appRoutes),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should start with invalid form', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should validate required name', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.markAsTouched();

      expect(component.getNameError()).toBe('O nome é obrigatório');
    });

    it('should validate required email', () => {
      const emailControl = component.registerForm.get('username');
      emailControl?.markAsTouched();

      expect(component.getEmailError()).toBe('O e-mail é obrigatório');
    });

    it('should validate invalid email format', () => {
      const emailControl = component.registerForm.get('username');
      emailControl?.setValue('emailinvalido');
      emailControl?.markAsTouched();

      expect(component.getEmailError()).toBe('O e-mail está inválido');
    });

    it('should validate required password', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.markAsTouched();

      expect(component.getPasswordError()).toBe('A senha é obrigatória');
    });

    it('should validate password confirmation match', () => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl =
        component.registerForm.get('confirmPassword');

      passwordControl?.setValue('senha123');
      confirmPasswordControl?.setValue('senha456');
      confirmPasswordControl?.markAsTouched();

      expect(component.getConfirmPasswordError()).toBe(
        'As senhas não coincidem'
      );
    });
  });

  describe('Register flow', () => {
    beforeEach(() => {
      component.registerForm.setValue({
        name: 'Usuário Teste',
        username: 'teste@email.com',
        password: 'senha123',
        confirmPassword: 'senha123',
      });
    });

    it('should navigate to login after successful registration', () => {
      const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
      mockAuthService.register.mockReturnValue(of(true));

      component.onSubmit();

      expect(mockAuthService.register).toHaveBeenCalledWith({
        name: 'Usuário Teste',
        username: 'teste@email.com',
        password: 'senha123',
      });
      expect(routerSpy).toHaveBeenCalledWith('/auth/login');
    });

    it('should handle registration error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAuthService.register.mockReturnValue(
        throwError(() => new Error('Register error'))
      );

      component.onSubmit();

      expect(mockAuthService.register).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not call register if form is invalid', () => {
      component.registerForm.get('username')?.setValue('');

      component.onSubmit();

      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('UI interactions', () => {
    it('should disable submit button when form is invalid', () => {
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.registerForm.setValue({
        name: 'Usuário Teste',
        username: 'teste@email.com',
        password: 'senha123',
        confirmPassword: 'senha123',
      });

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });

    it('should show error message when name is required', () => {
      fixture.detectChanges();
      const nameInput = fixture.debugElement.query(By.css('input[id="name"]'));
      nameInput.nativeElement.dispatchEvent(new Event('input'));
      nameInput.nativeElement.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage.nativeElement.textContent).toContain(
        'O nome é obrigatório'
      );
    });

    it('should show error message when passwords do not match', () => {
      component.registerForm.get('password')?.setValue('senha123');
      component.registerForm.get('confirmPassword')?.setValue('senha456');

      fixture.detectChanges();

      const confirmPasswordInput = fixture.debugElement.query(
        By.css('input[id="confirmPassword"]')
      );
      confirmPasswordInput.nativeElement.dispatchEvent(new Event('input'));
      confirmPasswordInput.nativeElement.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage.nativeElement.textContent).toContain(
        'As senhas não coincidem'
      );
    });
  });
});
