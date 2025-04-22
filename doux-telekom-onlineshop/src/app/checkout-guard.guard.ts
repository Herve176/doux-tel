import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from './authservice.service';

Injectable({
  providedIn: 'root',
});
export const checkoutGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService); // AuthService injizieren
  const router = inject(Router); // Router injizieren
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
