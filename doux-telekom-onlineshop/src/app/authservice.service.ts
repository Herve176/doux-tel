import { inject, Injectable } from '@angular/core';
import{ User} from './model/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private http = inject(HttpClient);
  private router = inject(Router); // Router injizieren
  private readonly API_URL = 'http://localhost:3000/'; // URL der API
  private readonly TOKEN_KEY = 'token'; // Schlüssel für das Token im LocalStorage
  constructor() {}
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
}
