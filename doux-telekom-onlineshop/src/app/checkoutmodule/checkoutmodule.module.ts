import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { Checkoutmodulerouting } from './checkoutmodule-routing.module';



@NgModule({
  declarations: [],
  imports: [CommonModule, CheckoutComponent, Checkoutmodulerouting],
})
export class CheckoutmoduleModule {}
