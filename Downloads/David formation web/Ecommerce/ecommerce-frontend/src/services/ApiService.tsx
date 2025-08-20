import type Article from "@/models/Article";

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      console.log('🌐 Making request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Received data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Search suggestions API
  async getSearchSuggestions(query: string): Promise<Article[]> {
    try {
      // Backend gibt nur Array zurück, wir holen alle Artikel und filtern frontend
      const allArticles = await this.request<Article[]>('/articles');
      
      return allArticles
        .filter(article => 
          article.name.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Begrenzen auf 5 Vorschläge
    } catch (error) {
      console.error('Search suggestions failed:', error);
      return [];
    }
  }

  // Articles API mit Frontend-Pagination
  async getArticles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: keyof Article;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    articles: Article[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      // Backend gibt nur Array zurück
      const allArticles = await this.request<Article[]>('/articles');
      
      let filteredArticles = [...allArticles];
      
      // Frontend-Filter für Suche
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article =>
          article.name.toLowerCase().includes(searchTerm) ||
          article.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Frontend-Filter für Kategorie (falls implementiert)
      if (params?.category) {
        // Hier könntest du Kategorien implementieren, falls deine Artikel eine category Property haben
        // filteredArticles = filteredArticles.filter(article => article.category === params.category);
      }
      
      // Frontend-Sortierung
      if (params?.sortBy) {
        filteredArticles.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Article];
          const bValue = b[params.sortBy as keyof Article];
          
          // Type-safe comparison
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            const aLower = aValue.toLowerCase();
            const bLower = bValue.toLowerCase();
            const comparison = aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
            return params.sortOrder === 'desc' ? -comparison : comparison;
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            const comparison = aValue - bValue;
            return params.sortOrder === 'desc' ? -comparison : comparison;
          }
          
          // Fallback für andere Typen
          const aStr = String(aValue);
          const bStr = String(bValue);
          const comparison = aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
          return params.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      // Frontend-Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 9;
      const totalCount = filteredArticles.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
      
      console.log(`📄 Page ${page}/${totalPages}, showing ${paginatedArticles.length} of ${totalCount} articles`);
      
      // Frontend erstellt das erwartete Response-Format
      return {
        articles: paginatedArticles,
        totalCount,
        currentPage: page,
        totalPages
      };
      
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  }

  async getArticleById(id: number): Promise<Article> {
    try {
      // Da Backend keine einzelnen Artikel-Endpunkte hat, holen wir alle und filtern
      const allArticles = await this.request<Article[]>('/articles');
      const article = allArticles.find(a => a.id === id);
      
      if (!article) {
        throw new Error(`Article with id ${id} not found`);
      }
      
      console.log('📝 Found article:', article);
      return article;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();

// Development helper - accessible in browser console
if (process.env.NODE_ENV === 'development') {
  // Lösung 1: Über unknown casten (TypeScript-empfohlene Lösung)
  (window as unknown as { apiService: ApiService }).apiService = apiService;
  
  // Oder Lösung 2: Direkter Assignment (einfacher)
  // (window as any).apiService = apiService;
  
  // Oder Lösung 3: Type Declaration erweitern (am saubersten)
  // declare global {
  //   interface Window {
  //     apiService: ApiService;
  //   }
  // }
  // window.apiService = apiService;
}