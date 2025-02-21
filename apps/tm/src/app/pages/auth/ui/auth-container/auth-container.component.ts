import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-container',
  imports: [CommonModule],
  templateUrl: './auth-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainerComponent {
  @Input() title = '';
  @Input() description = '';

  get currentYear() {
    return new Date().getFullYear();
  }
}
