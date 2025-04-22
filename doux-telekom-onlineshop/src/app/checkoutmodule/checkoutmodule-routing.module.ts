import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { CommonModule } from '@angular/common';
import { checkoutGuardGuard } from '../checkout-guard.guard';

const routes: Routes = [{ path: '', component: CheckoutComponent,canActivate:[checkoutGuardGuard] }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class Checkoutmodulerouting {}
