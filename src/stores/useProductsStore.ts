import { create } from "zustand";
import API from "../_app_back/lib/api.js";

type ProductsState = {
  products: any[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error?: string | null;
  categories: any[]; // ✅ Change from string[] to any[]
  fetchProducts: (opts?: { page?: number; limit?: number; search?: string; category?: string }) => Promise<void>;
  fetchProduct: (id: number) => Promise<any>;
  fetchCategories: () => Promise<void>;
};

// DummyJSON base URL define karein
const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  page: 0,
  limit: 10,
  loading: false,
  error: null,
  categories: [],

  fetchProducts: async ({ page = 0, limit = 10, search, category } = {}) => {
    set({ loading: true, error: null });
    try {
      let url: string;
      
      if (search) {
        // Search products
        url = `${DUMMYJSON_BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${page * limit}`;
      } else if (category) {
        // Products by category
        url = `${DUMMYJSON_BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${page * limit}`;
      } else {
        // All products with pagination
        url = `${DUMMYJSON_BASE_URL}/products?limit=${limit}&skip=${page * limit}`;
      }

      const res = await API.get(url);

      set({
        products: res.data.products || res.data,
        total: res.data.total || res.data.length,
        page,
        limit,
        loading: false
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message, 
        loading: false 
      });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await API.get(`${DUMMYJSON_BASE_URL}/products/${id}`);
      set({ loading: false });
      return res.data;
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.response?.data?.message || err.message 
      });
      return null;
    }
  },

  fetchCategories: async () => {
    if (get().categories.length) return;
    try {
      const res = await API.get(`${DUMMYJSON_BASE_URL}/products/categories`);
      
      // ✅ DEBUG: Console mein data check karein
      console.log('Categories API response:', res.data);
      console.log('First item type:', typeof res.data[0]);
      console.log('First item:', res.data[0]);
      
      // ✅ FIX: Transform data agar objects hain
      let categoriesData = res.data;
      
      // Agar objects hain to extract slug ya name
      if (categoriesData.length > 0 && typeof categoriesData[0] === 'object') {
        console.log('Transforming object categories to strings...');
        categoriesData = categoriesData.map((cat: any) => {
          // Priority: slug > name > entire object as string
          return cat.slug || cat.name || JSON.stringify(cat);
        });
      }
      
      console.log('Transformed categories:', categoriesData);
      set({ categories: categoriesData });
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }
}));