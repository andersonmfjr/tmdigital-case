import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../shared/lib/auth/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { LoginResponse } from '../../../../shared/model/auth.model';
import { appRoutes } from '../../../../app/app.routes';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        AuthContainerComponent],
      providers: [
        provideRouter(appRoutes),
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should start with invalid form', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should validate required email', () => {
      const emailControl = component.loginForm.get('username');
      emailControl?.markAsTouched();
      expect(component.getEmailError()).toBe('O e-mail é obrigatório');
    });

    it('should validate invalid email format', () => {
      const emailControl = component.loginForm.get('username');
      emailControl?.setValue('emailinvalido');
      emailControl?.markAsTouched();

      expect(component.getEmailError()).toBe('O e-mail está inválido');
    });

    it('should validate required password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      expect(component.getPasswordError()).toBe('A senha é obrigatória');
    });
  });

  describe('Login flow', () => {
    beforeEach(() => {
      component.loginForm.setValue({
        username: 'teste@email.com',
        password: 'senha123'
      });
    });

    it('should navigate to credit-analysis when user has completed onboarding', () => {
      const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
      mockAuthService.login.mockReturnValue(of({
        user: { hasCompletedOnboarding: true }
      } as unknown as LoginResponse));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith('teste@email.com', 'senha123');
      expect(routerSpy).toHaveBeenCalledWith('/credit-analysis');
      expect(component.isLoading).toBeFalsy();
    });

    it('should navigate to onboarding when user has not completed onboarding', () => {
      const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
      mockAuthService.login.mockReturnValue(of({
        user: { hasCompletedOnboarding: false }
      } as unknown as LoginResponse));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith('teste@email.com', 'senha123');
      expect(routerSpy).toHaveBeenCalledWith('/onboarding');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle login error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAuthService.login.mockReturnValue(throwError(() => new Error('Login error')));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith('teste@email.com', 'senha123');
      expect(component.isLoading).toBeFalsy();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not call login if form is invalid', () => {
      component.loginForm.get('username')?.setValue('');

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('UI interactions', () => {
    it('should disable submit button when form is invalid', () => {
      fixture.detectChanges();
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.get('username')?.setValue('teste@email.com');
      component.loginForm.get('password')?.setValue('senha123');

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    })

    it('should show error message when email is invalid', () => {
      component.loginForm.get('username')?.setValue('emailinvalido');

      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css('input'));
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      emailInput.nativeElement.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage.nativeElement.textContent).toContain('O e-mail está inválido');
    })

    it('should show error message when password is invalid', () => {
      component.loginForm.get('password')?.setValue('');
      fixture.detectChanges();

      const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.nativeElement.textContent).toContain('A senha é obrigatória');
    })
  })
});
