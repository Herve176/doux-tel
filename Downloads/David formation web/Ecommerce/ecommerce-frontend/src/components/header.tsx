import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from "react";
import type Article from "@/models/Article";
import Loader from "@/components/loader";
import { apiService } from '../services/ApiService';


export default function Header() {
  const [searchItem, setSearchItem] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredArticles([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowSuggestions(true);

    try {
      const suggestions = await apiService.getSearchSuggestions(query);
      setFilteredArticles(suggestions);
    } catch (err) {
      console.error('Search suggestions failed:', err);
      setError('Fehler beim Laden der Suchvorschläge');
      setFilteredArticles([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Input Change Handler with Debounced API Search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchItem(value);
    setSelectedIndex(-1);
    setError(null);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim()) {
      // Debounce API call by 300ms
      debounceTimer.current = setTimeout(() => {
        debouncedSearch(value);
      }, 300);
    } else {
      setShowSuggestions(false);
      setFilteredArticles([]);
      setIsSearching(false);
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIndex >= 0 && filteredArticles[selectedIndex]) {
      handleSuggestionClick(filteredArticles[selectedIndex]);
    } else {
      performSearch();
    }
  };

  // Keyboard Navigation
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || (filteredArticles.length === 0 && !isSearching)) {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isSearching) {
          setSelectedIndex(prev => 
            prev < filteredArticles.length ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isSearching) {
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (!isSearching && selectedIndex >= 0 && filteredArticles[selectedIndex]) {
          handleSuggestionClick(filteredArticles[selectedIndex]);
        } else if (selectedIndex === filteredArticles.length) {
          // "Alle Ergebnisse anzeigen" option selected
          performSearch();
        } else {
          performSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setIsSearching(false);
        setError(null);
        break;
    }
  };

  // Handle Suggestion Click
  const handleSuggestionClick = (article: Article) => {
    navigate(`/articles/${article.id}`);
    setShowSuggestions(false);
    setSearchItem("");
    setSelectedIndex(-1);
    setIsSearching(false);
    setError(null);
  };

  // Central Search Logic
  const performSearch = () => {
    if (searchItem.trim()) {
      setShowSuggestions(false);
      setIsSearching(false);
      setError(null);
      navigate(`/?search=${encodeURIComponent(searchItem.trim())}`);
    }
  };

  // Handle Input Focus
  const handleInputFocus = () => {
    if (searchItem.trim() && (filteredArticles.length > 0 || isSearching)) {
      setShowSuggestions(true);
    }
  };

  // Handle Input Blur with delay for clicks
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setIsSearching(false);
      setError(null);
    }, 200);
  };

  // Cleanup debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <header>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div>24/7 Customer service: +237696169573</div>
        <div className="flex flex-row space-x-4">
          <a href="#" className="hover:underline">Shipping & Returns</a>
          <a href="#" className="hover:underline">Track Orders</a>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-2xl font-bold text-gray-800">Electronic Store</div>
        
        <div className="flex items-center space-x-2">
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchItem}
                onChange={handleSearch}
                onKeyDown={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="border rounded px-3 py-2 text-gray-700 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                autoComplete="off"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                  
                  {/* Loading State */}
                  {isSearching && (
                    <div className="p-4">
                      <Loader variant="search" />
                    </div>
                  )}
                  
                  {/* Error State */}
                  {error && !isSearching && (
                    <div className="p-4 text-center text-red-500">
                      <svg className="w-8 h-8 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="text-sm">{error}</div>
                      <button 
                        onClick={() => debouncedSearch(searchItem)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Erneut versuchen
                      </button>
                    </div>
                  )}
                  
                  {/* Search Results */}
                  {!isSearching && !error && filteredArticles.length > 0 && (
                    <>
                      {filteredArticles.map((article, index) => (
                        <div
                          key={article.id}
                          onClick={() => handleSuggestionClick(article)}
                          className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                            index === selectedIndex 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img 
                              src={article.image} 
                              alt={article.name}
                              className="w-12 h-12 object-cover rounded"
                              loading="lazy"
                              onError={(e) => {
                                // Fallback image on error
                                e.currentTarget.src = 'https://via.placeholder.com/48x48/e2e8f0/64748b?text=?';
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800 mb-1">
                                {article.name}
                              </div>
                              <div className="text-blue-600 font-semibold text-sm">
                                {article.price} €
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {article.description}
                              </div>
                            </div>
                            <div className="text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* "Alle Ergebnisse anzeigen" Option */}
                      <div
                        onClick={performSearch}
                        className={`p-3 cursor-pointer border-t-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors ${
                          selectedIndex === filteredArticles.length 
                            ? 'bg-blue-50 border-blue-200' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Alle Ergebnisse für "{searchItem}" anzeigen</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* No Results Message */}
                  {!isSearching && !error && searchItem.trim() && filteredArticles.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <div className="text-sm">Keine Produkte gefunden für "{searchItem}"</div>
                      <div className="text-xs text-gray-400 mt-1">Versuchen Sie andere Suchbegriffe</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              type="submit"
              className="p-2 text-gray-600 hover:text-blue-600 transition disabled:opacity-50"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex justify-center items-center p-4 bg-white shadow">
        <nav className="flex space-x-15">
          <Link to="/" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Home</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">New Arrivals</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Deals</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Promotion</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Phones</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Pcs</Link>
          <Link to="/cart" className="text-gray-700 no-underline hover:text-blue-600 hover:underline">Tablet</Link>
        </nav>
        <div className="flex items-center space-x-4 ml-auto">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/cart" className="hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a .75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}