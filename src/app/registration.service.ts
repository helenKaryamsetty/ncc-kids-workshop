import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface RegistrationDetails {
  childName: string;
  childClass: string;
  parentName: string;
  parentPhone: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly http = inject(HttpClient);

  register(details: RegistrationDetails): Observable<void> {
    return this.http.post<{ success: boolean }>('/api/register', details).pipe(
      map((result) => {
        if (!result.success) {
          throw new Error('Registration was not saved.');
        }
      })
    );
  }
}