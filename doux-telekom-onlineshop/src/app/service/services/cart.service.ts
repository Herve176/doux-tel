import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Product } from '../../model/model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly API_URL = 'http://localhost:3000/products';
  private cartProductsSubject = new BehaviorSubject<Product[]>([]);
  public cartProducts$ = this.cartProductsSubject.asObservable();
  public addToCartsignal = signal<Product[]>([]); // Initialize as an empty array
  constructor(private http: HttpClient) {
    this.fetchInitialProducts(); // Auto-fetch on service initialization
  }

  // Fetch initial products (called automatically)
  fetchInitialProducts(): void {
    this.http
      .get<{ data: Product[] }>(this.API_URL)
      .pipe(
        map((response) => response.data),
        map((products) => this.mapProducts(products)),
        tap((products) => this.cartProductsSubject.next(products)),
        catchError((error) => {
          console.error('Error fetching products:', error);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Add a product to cart
  addProduct(product: Product): void {
    const current = this.cartProductsSubject.value;
    this.cartProductsSubject.next([...current, product]);
    this.addToCartsignal.update((products) => [...products, product]);
  }

  // Get current products
  getCartProducts(): Observable<Product[]> {
    return this.cartProducts$;
  }

  // Optional: Refresh products
  refreshProducts(): void {
    this.http
      .get<{ data: Product[] }>(this.API_URL)
      .pipe(
        map((response) => response.data),
        map((products) => this.mapProducts(products)),
        tap((products) => this.cartProductsSubject.next(products))
      )
      .subscribe();
  }

  // Helper to map product images
  private mapProducts(products: Product[]): Product[] {
    return products.map((product) => ({
      ...product,
      imageUrl: product.image || 'assets/default-product.png', // Fallback image
    }));
  }
  // Getter for the cart signal
  get cartProductsSignal(): Product[] {
    return this.addToCartsignal();
  }
  removeFromCart(index: number): void {
    this.addToCartsignal.update((items) => {
      const updated = [...items];
      updated.splice(index, 1);
      return updated;
    });
    // Also update the BehaviorSubject if needed
    this.cartProductsSubject.next(this.addToCartsignal());
  }
}
