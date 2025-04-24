import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchserviceService {
  private searchQuerySubject = new BehaviorSubject<string>(''); // Holds the search query
  searchQuery$ = this.searchQuerySubject.asObservable(); // Observable for components to subscribe to

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query); // Update the search query
  }
}
