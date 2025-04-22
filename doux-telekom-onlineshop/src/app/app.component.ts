import { CommonModule } from '@angular/common';
import { Component, computed, effect } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
  Router,
} from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchserviceService } from './searchservice.service';
import { Product } from './model/model';
import { CartService } from './service/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  searchQuery: string = '';
  cartCount = computed(() => this.cartService.addToCartsignal().length);
  onSearch(event: Event): void {
    event.preventDefault(); // Prevent form submission
    this.searchService.setSearchQuery(this.searchQuery); // Update the search query
  }

  isRegisterPage = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private searchService: SearchserviceService,
    private cartService: CartService
  ) {
    // Überwache Routenänderungen
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Überprüfe, ob der Benutzer auf der Register-Seite ist
        this.isRegisterPage = event.urlAfterRedirects.includes('/register');
      }
    });
  }
}
