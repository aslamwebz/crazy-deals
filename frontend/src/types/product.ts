export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  image?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products_count?: number; // Number of products in this category
  order?: number; // For sorting categories
}

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  sku: string;
  price: number;
  compare_at_price: number;
  cost_per_item?: number;
  quantity: number;
  total_quantity: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'preorder' | 'on_backorder';
  is_taxable: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_flash_deal: boolean;
  flash_deal_starts_at?: string | null;
  flash_deal_ends_at?: string | null;
  requires_shipping: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  status: 'draft' | 'active' | 'archived';
  rating?: number;
  reviews_count?: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: Category;
  images?: ProductImage[];
  primary_image?: string;
  
  // Computed
  in_stock: boolean;
  is_on_sale: boolean;
  discount_percentage?: number;
  is_flash_deal_active: boolean;
}
