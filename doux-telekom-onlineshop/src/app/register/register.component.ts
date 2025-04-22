import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthserviceService } from '../authservice.service'; // Importiere den Authservice
import { User } from '../model/model'; // Importiere das User-Modell
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Korrigiert: styleUrls statt styleUrl
})
export class RegisterComponent {
  registerForm: FormGroup;
  // Definition des Formulars
  constructor(
    private userService: AuthserviceService,
  ) {
    // Injizieren des Authservice
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}'), // Mindestens ein Großbuchstabe, ein Kleinbuchstabe und eine Zahl
        ]),
        repeatPassword: new FormControl('', Validators.required),
        subscribe: new FormControl(false), // Optionales Kontrollkästchen
      },
      { validators: this.passwordsMatchValidator } // Benutzerdefinierte Validierung
    );
  }

  // Benutzerdefinierte Validierung: Überprüft, ob Passwort und Wiederholung übereinstimmen
  passwordsMatchValidator(
    group: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }

  // Methode, die beim Absenden des Formulars aufgerufen wird
  registersubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.userService.registerUser(user).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response); // Redirect to login page after successful registration
          this.showToast('successToast');
        },
        error: (error) => {
          console.error('Error registering user:', error);
          alert('Registration failed. Please try again.');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Methode, um Toast-Nachricht anzuzeigen
  private showToast(toastId: string) {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new (window as any).bootstrap.Toast(toastElement); // Access Bootstrap's Toast API
      toast.show();
    }
  }
}
