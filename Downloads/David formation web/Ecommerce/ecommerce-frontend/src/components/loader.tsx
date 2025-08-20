import React from 'react';

interface LoaderProps {
  variant?: 'articles' | 'search' | 'page' | 'compact';
  count?: number;
}

export default function Loader({ variant = 'articles', count = 9 }: LoaderProps) {
  if (variant === 'articles') {
    return (
      <div className="bg-gray-50 min-h-[50vh] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="mb-8 text-center">
            <div className="h-8 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-60 mx-auto animate-pulse"></div>
          </div>

          {/* Articles Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Skeleton */}
                <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  
                  {/* Description - 2 lines */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-blue-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-blue-200 rounded-lg w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center items-center mt-12 space-x-4">
            <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'search') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-md p-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-blue-200 rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Laden...</span>
        </div>
      </div>
    );
  }

  // Default page loader
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated circles */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Spinning loader */}
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Artikel werden geladen...</h3>
        <p className="text-gray-600">Bitte warten Sie einen Moment</p>
      </div>
    </div>
  );
}

// Specific loader components for different use cases
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-blue-200 rounded w-20"></div>
          <div className="h-10 bg-blue-200 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function SearchSuggestionSkeleton() {
  return (
    <div className="p-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-blue-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}