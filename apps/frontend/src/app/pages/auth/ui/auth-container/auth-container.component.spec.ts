import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthContainerComponent } from './auth-container.component';
import { CommonModule } from '@angular/common';

describe('AuthContainerComponent', () => {
  let component: AuthContainerComponent;
  let fixture: ComponentFixture<AuthContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthContainerComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const title = 'Test Title';
    component.title = title;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('h1');
    expect(element.textContent).toContain(title);
  });

  it('should display the description', () => {
    const description = 'Test Description';
    component.description = description;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('p');
    expect(element.textContent).toContain(description);
  });

  it('should display the current year', () => {
    const currentYear = new Date().getFullYear().toString();
    fixture.detectChanges();
    const yearElement = fixture.nativeElement.querySelector('.text-white');
    expect(yearElement.textContent).toContain(currentYear);
  });
});
