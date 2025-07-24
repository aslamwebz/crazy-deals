import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Product, Category } from '@/types/product';

const API_BASE_URL = 'http://localhost:8084/api'; // Backend server is running on port 8084

// Define response types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  meta?: any;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Create a custom type for our API client
interface ApiClient extends AxiosInstance {
  get<T = any, R = AxiosResponse<T>>(url: string, config?: any): Promise<T>;
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: any): Promise<T>;
}

const api: ApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptors for handling errors and unwrapping data
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // If the response has a data property, return it directly
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Handle errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const productApi = {
  getFeaturedProducts: (): Promise<Product[]> => 
    api.get<ApiResponse<Product[]>>('/products/featured').then(response => response as unknown as Product[]),
    
  getFlashDeals: (): Promise<Product[]> => 
    api.get<ApiResponse<Product[]>>('/products/flash-deals').then(response => response as unknown as Product[]),
    
  getCategories: (): Promise<Category[]> => 
    api.get<ApiResponse<Category[]>>('/categories').then(response => response as unknown as Category[]),
    
  getProductBySlug: (slug: string): Promise<Product> => 
    api.get<ApiResponse<Product>>(`/products/${slug}`).then(response => response as unknown as Product),
};

export default api;
