import { inject, Injectable } from '@angular/core';
import { User } from './model/model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './service/services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private http = inject(HttpClient);
  private router = inject(Router); // Router injizieren
  private readonly API_URL = 'http://localhost:8081'; // URL der API
  private readonly TOKEN_KEY = 'token'; // Schlüssel für das Token im LocalStorage
  constructor(private toastService: ToastService) {}
  // Überprüfen, ob der Benutzer eingeloggt ist
  // Check if the token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expiry = payload.exp * 1000; // Convert expiry to milliseconds
    return Date.now() > expiry;
  }

  // Updated isLoggedIn method
  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
  // Token aus dem LocalStorage abrufen
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Token im LocalStorage speichern
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Token aus dem LocalStorage entfernen (Logout)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  //login
  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<{ token: string }>(`${this.API_URL}/login`, { email, password })
        .subscribe({
          next: (response) => {
            this.setToken(response.token); // Save the token in localStorage
            this.router.navigate(['/home']); // Redirect to home
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }
  // Register user and redirect to home
  registerUser(user: User): Observable<User> {
    return new Observable((observer) => {
      this.http.post<User>(`${this.API_URL}/register`, user).subscribe({
        next: (response) => {
          this.router.navigate(['/home']); // Redirect to home
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }
  googleLogin(idToken: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<{ token: string }>(
          `${this.API_URL}/api/auth/google`,
          { id_token: idToken }, // Changed key to match backend expectation
          {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            observe: 'response', // Get full HttpResponse
          }
        )
        .subscribe({
          next: (response) => {
            if (response.body?.token) {
              this.setToken(response.body.token);
              this.router.navigate(['/home']);
              observer.next(response.body);

              this.toastService.show({
                template: `<div class="toast-body">Google login successful!</div>`,
                classname: 'bg-success text-light',
                delay: 5000,
              });
            } else {
              throw new Error('No token received');
            }
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            let errorMessage = 'Google login failed. Please try again.';

            // Handle JSON error responses
            if (error.error instanceof Object) {
              errorMessage = error.error.error || JSON.stringify(error.error);
            }
            // Handle text/plain responses
            else if (typeof error.error === 'string') {
              try {
                const parsedError = JSON.parse(error.error);
                errorMessage = parsedError.error || error.error;
              } catch {
                errorMessage = error.error;
              }
            }

            this.toastService.show({
              template: `<div class="toast-body">${errorMessage}</div>`,
              classname: 'bg-danger text-light',
              delay: 5000,
            });

            observer.error(error);
          },
        });
    });
  }
  exchangeCodeForToken(code: string): Observable<any> {
    return this.http.post(`${this.API_URL}/api/auth/google`, { code });
  }
}
