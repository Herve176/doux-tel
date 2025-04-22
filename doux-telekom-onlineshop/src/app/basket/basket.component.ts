import { Component, computed } from '@angular/core';
import { CartService } from '../service/services/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../model/model';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  // Get the signal value from the service
  cartItems =computed(() => this.cartService.addToCartsignal()); // Use the signal directly

  // Computed property for total items
  totalItems = computed(() => this.cartItems().length);

  // Computed property for total price
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price || 0), 0)
  );

  constructor(private cartService: CartService) {}

  // TrackBy function for better performance
  trackByFn(index: number, item: Product): string {
    return item.id; // or any unique identifier
  }

  // Remove item from cart
  removeItem(index: number): void {
    this.cartService.removeFromCart(index); // You'll need to implement this in your service
  }
}
