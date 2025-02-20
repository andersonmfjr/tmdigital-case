import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { ButtonSize, ButtonVariant } from '../../model/button.model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  viewProviders: [provideIcons({
    lucideLoader
  })],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (this.disabled || this.loading) {
      return;
    }

    this.clicked.emit();
  }

  get buttonClasses(): string {
    const baseClasses = `
      relative
      inline-flex
      items-center
      justify-center
      font-medium
      rounded-md
      transition-colors
      disabled:opacity-50
      disabled:cursor-not-allowed
      ${this.fullWidth ? 'w-full' : ''}
    `;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
      primary: `
        bg-brand-500 
        text-white 
        hover:bg-brand-600 
        focus:outline-none 
        focus:ring-2 
        focus:ring-brand-500 
        focus:ring-offset-2
      `,
      secondary: `
        bg-white 
        text-gray-700 
        border 
        border-gray-300 
        hover:bg-gray-50 
        focus:outline-none 
        focus:ring-2 
        focus:ring-brand-500 
        focus:ring-offset-2
      `,
      ghost: `
        bg-transparent 
        text-gray-700 
        hover:bg-gray-100 
        focus:outline-none 
        focus:ring-2 
        focus:ring-brand-500 
        focus:ring-offset-2
      `,
      link: `
        bg-transparent 
        text-brand-500 
        hover:text-brand-600 
        underline 
        focus:outline-none 
        p-0
      `
    };

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
    `;
  }
}
