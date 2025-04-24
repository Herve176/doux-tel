import {
  provideRouter,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { BasketComponent } from './basket/basket.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { checkoutGuardGuard } from './checkout-guard.guard';
import { ApplicationConfig } from '@angular/core';
import { GoogleCallbackComponent } from './google-callback/google-callback.component';
export const routes: Routes = [
  { path: 'details/:id', component: DetailsComponent },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },
  { path: 'basket', component: BasketComponent },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkoutmodule/checkoutmodule.module').then(
        (m) => m.CheckoutmoduleModule
      ),
    canLoad: [checkoutGuardGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./card/card.component').then((m) => m.CardComponent),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};
