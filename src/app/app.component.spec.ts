import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the workshop registration form', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Workshop');
    expect(compiled.querySelectorAll('form input').length).toBe(3);
    expect(Array.from(compiled.querySelectorAll('#childClass option')).map((option) => option.textContent?.trim())).toEqual([
      'Select a class', 'Toddlers', 'Beginners', 'Primary', 'Juniors', 'Teens', 'Seniors'
    ]);
  });

  it('should require all four registration fields', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const form = fixture.componentInstance.registrationForm;
    expect(form.invalid).toBeTrue();
    expect(Object.values(form.controls).every((control) => control.hasError('required'))).toBeTrue();
  });

  it('should reject invalid Indian mobile numbers', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const phone = fixture.componentInstance.registrationForm.controls.parentPhone;
    phone.setValue('1234567890');
    expect(phone.hasError('pattern')).toBeTrue();
  });
});
