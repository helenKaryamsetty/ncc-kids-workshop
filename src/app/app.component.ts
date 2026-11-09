import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly registrationService = inject(RegistrationService);

  readonly registrationForm = this.formBuilder.nonNullable.group({
    childName: ['', [Validators.required, Validators.maxLength(80)]],
    childClass: ['', [Validators.required, Validators.maxLength(40)]],
    parentName: ['', [Validators.required, Validators.maxLength(80)]],
    parentPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
  });

  isSubmitting = false;
  isSubmitted = false;
  submitted = false;
  errorMessage = '';

  submitRegistration(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.registrationService.register(this.registrationForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitted = true;
      },
      error: (error: unknown) => {
        const responseMessage = error instanceof HttpErrorResponse ? error.error?.message : undefined;
        this.errorMessage = typeof responseMessage === 'string'
          ? responseMessage
          : 'We could not save your registration just now. Please try again in a moment.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  registerAnotherChild(): void {
    this.registrationForm.reset();
    this.submitted = false;
    this.isSubmitted = false;
    this.errorMessage = '';
  }
}
