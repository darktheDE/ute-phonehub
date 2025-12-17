'use client';

import { useState } from 'react';
import type { Product } from '@/types';

// Note: Public product endpoints don't exist yet
// This hook is kept for future use when endpoints are available
// Components should use mock data directly for now

interface UseProductsOptions {
  limit?: number;
  categoryId?: number;
  brandId?: number;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  // Return empty - components will use mock data
  return { 
    products: [] as Product[], 
    loading: false, 
    error: null, 
    refetch: () => {} 
  };
}

export function useFeaturedProducts(limit: number = 8) {
  // Return empty - components will use mock data
  return { 
    products: [] as Product[], 
    loading: false, 
    error: null, 
    refetch: () => {} 
  };
}

