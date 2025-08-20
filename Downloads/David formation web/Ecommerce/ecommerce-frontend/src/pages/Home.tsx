import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Article from "@/models/Article";
import Loader from "@/components/loader";
import { apiService } from "@/services/ApiService";
import { useCart } from "@/stores/CartContextType";

const articlesPerPage = 9;

interface HomeArticlesResponse {
  articles: Article[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Cart Context verwenden
  const { addToCart, isInCart } = useCart();
  
  // Suchbegriff aus URL lesen
  const searchTerm = searchParams.get('search') || '';

  // API-Aufruf für Artikel laden
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: HomeArticlesResponse = await apiService.getArticles({
        page: currentPage,
        limit: articlesPerPage,
        search: searchTerm || undefined,
      });

      setArticles(response.articles || []);
      setTotalPages(response.totalPages || 0);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Artikel');
      setArticles([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Artikel laden wenn sich Parameter ändern
  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm]);

  // Seite zurücksetzen wenn sich Suchbegriff ändert
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddToCart = (article: Article) => {
    addToCart(article);
  };

  const clearSearch = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  const retryFetch = () => {
    fetchArticles();
  };

  // Show loading state
  if (loading) {
    return <Loader variant="articles" count={articlesPerPage} />;
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-[70vh] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Fehler beim Laden der Artikel</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={retryFetch}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Erneut versuchen
              </button>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Alle Artikel anzeigen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[70vh] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Suchinformationen anzeigen */}
        {searchTerm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Suchergebnisse für: <span className="text-blue-600">"{searchTerm}"</span>
                </h2>
                <p className="text-gray-600">
                  {totalCount} {totalCount === 1 ? 'Artikel gefunden' : 'Artikel gefunden'}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Suche löschen</span>
              </button>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {searchTerm ? `Suchergebnisse` : 'Unsere Top-Angebote'}
        </h1>
        
        {/* Keine Ergebnisse */}
        {articles && articles.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? `Keine Artikel gefunden für "${searchTerm}"` : 'Keine Artikel verfügbar'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Versuchen Sie es mit anderen Suchbegriffen oder durchstöbern Sie unsere Kategorien.'
                : 'Es sind derzeit keine Artikel verfügbar.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Alle Artikel anzeigen
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Artikel Grid */}
            {articles && articles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {articles.map(article => (
                  <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <Link to={`/articles/${article.id}`}>
                      <img
                        src={article.image}
                        alt={article.name}
                        className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Bild+nicht+verfügbar';
                        }}
                      />
                    </Link>
                    <div className="p-4 flex-1 flex flex-col">
                      <Link to={`/articles/${article.id}`}>
                        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                          {article.name}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{article.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold text-blue-600">{article.price.toFixed(2)} €</span>
                        <button
                          onClick={() => handleAddToCart(article)}
                          disabled={isInCart(article.id)}
                          className={`px-4 py-2 rounded font-medium transition ${
                            isInCart(article.id)
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isInCart(article.id) ? (
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Im Warenkorb</span>
                            </span>
                          ) : (
                            "In den Warenkorb"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination bleibt gleich... */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>

                <div className="flex items-center space-x-2">
                  {(() => {
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          disabled={loading}
                          className="w-10 h-10 rounded-lg font-medium transition bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="dots1" className="px-2 text-gray-500">...</span>
                        );
                      }
                    }

                    for (let page = startPage; page <= endPage; page++) {
                      pages.push(
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="dots2" className="px-2 text-gray-500">...</span>
                        );
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loading}
                          className="w-10 h-10 rounded-lg font-medium transition bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Weiter
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Seiten-Info */}
            {totalCount > 0 && (
              <div className="text-center mt-6 text-gray-500 text-sm">
                Seite {currentPage} von {totalPages} ({totalCount} Artikel insgesamt)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}