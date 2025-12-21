/**
 * Category types matching backend DTOs
 */

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  parentName?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
}

export interface CategoryResponse {
  id: number;
  name: string;
  parentId: number | null;
  parentName?: string;
  hasChildren?: boolean;
  childrenCount: number;  // Số lượng danh mục con
  productCount: number;   // Số lượng sản phẩm
  createdAt: string;
  updatedAt: string;
}

