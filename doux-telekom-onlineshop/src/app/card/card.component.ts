import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CartService } from '../service/services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../model/model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SearchserviceService } from '../searchservice.service';
import { Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = []; // Filtered products for display
  isLoading = true;
  locale!: String;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private searchService: SearchserviceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService
      .getCartProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products; // Initialize filtered products
          this.isLoading = false;
          this.cdr.markForCheck(); // Trigger change detection for OnPush
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });

    this.cartService.fetchInitialProducts();

    // Subscribe to search query changes
    this.searchService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.filterProducts(query);
      });
  }
  filterProducts(query: string): void {
    const lowerCaseQuery = query.trim().toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
    );
    this.cdr.markForCheck(); // Trigger change detection for OnPush
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product); // Optionally sync with CartService
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  viewDetails(product: Product) {
    this.router.navigate(['/details', product.id], {
      state: { product }, // Pass the entire product object
    });
  }
}
