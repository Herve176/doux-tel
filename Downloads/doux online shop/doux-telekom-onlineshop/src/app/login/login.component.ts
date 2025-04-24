import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { User } from '../model/model'; // Importiere das User-Modell
import { HttpClientModule } from '@angular/common/http';
import { NgbdToastGlobal } from '../toast-global/toast-global.component';
import { ToastService } from '../service/services/toast-service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private authService: AuthserviceService,
    private toastService: ToastService // Inject ToastService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void { // Initialize Google Sign-In callback
    (window as any).onGoogleSignIn = (response: any) => {
      console.log('we are in function');
      const idToken = response.credential; // Capture the ID token
      console.log('Google ID Token:', idToken);

      // Send the ID token to the backend for verification
      this.authService.googleLogin(idToken).subscribe({
        next: (res) => {
          console.log('Google login successful:', res);
        },
        error: (err) => {
          console.error('Google login failed:', err);
        },
      });
    };
  }

  onSubmit(successToast: TemplateRef<any>, errorToast: TemplateRef<any>): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
        },
        error: () => {
        },
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
