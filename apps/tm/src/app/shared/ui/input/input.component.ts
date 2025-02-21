import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileWarning } from '@ng-icons/lucide';
import { InputType } from '../../model/input.model';


@Component({
  selector: 'app-input',
  imports: [CommonModule, NgIcon],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  viewProviders: [provideIcons({
    lucideFileWarning
  })],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '' + Math.random() + Math.random();
  @Input() label?: string;
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error?: string;
  @Input() hint?: string;

  value = '';
  touched = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (_value: string) => { };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  get inputClasses() {
    return `
      w-full 
      px-3 
      py-2 
      border 
      rounded-md 
      transition-colors
      ${this.error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-brand-500'
      }
      ${this.disabled
        ? 'bg-gray-100 cursor-not-allowed'
        : 'bg-white'
      }
      focus:outline-none 
      focus:ring-2 
      focus:border-transparent
    `;
  }
}
