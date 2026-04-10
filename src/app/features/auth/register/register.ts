import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth.js';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value ?? '';
  const repeatPassword = control.get('repeatPassword')?.value ?? '';

  return password === repeatPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  isSubmitting = false;
  submitError = '';

  form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator },
  );

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  get repeatPasswordControl() {
    return this.form.controls.repeatPassword;
  }

  get hasPasswordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') && this.repeatPasswordControl.touched;
  }

  async onSubmit(): Promise<void> {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.register(this.normalizeEmail(email), password);
      await this.router.navigateByUrl('/');
    } catch (error: unknown) {
      this.submitError = this.auth.getErrorMessage(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
