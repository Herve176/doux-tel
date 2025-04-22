import { Component, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../service/services/cart.service';
import { Product } from '../model/model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() id!: string;
  product: Product;
  cartItems = computed(() => this.cartService.addToCartsignal()); // Use the signal directly
  constructor(private cartService: CartService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'];
  } // Inject the CartService
  addToCart(product:Product): void {
    this.cartService.addProduct(product); // Optionally sync with CartService
  }
}
