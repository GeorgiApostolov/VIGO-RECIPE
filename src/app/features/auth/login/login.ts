import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth.js';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  isSubmitting = false;
  submitError = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
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
      await this.auth.login(this.normalizeEmail(email), password);
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
