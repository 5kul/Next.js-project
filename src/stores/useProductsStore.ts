import { create } from "zustand";
import API from "../app/lib/api.js";


type ProductsState = {
  products: any[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error?: string | null;
  categories: string[];
  fetchProducts: (opts?: { page?: number; limit?: number; search?: string; category?: string }) => Promise<void>;
  fetchProduct: (id: number) => Promise<any>;
  fetchCategories: () => Promise<void>;
};

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
      let url = `/products?limit=${limit}&skip=${page * limit}`;
      if (search) url = `/products/search?q=${encodeURIComponent(search)}`;
      if (category) url = `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${page * limit}`;

      const res = await API.get(url);

      set({
        products: res.data.products || res.data,
        total: res.data.total || res.data.length,
        page,
        limit,
        loading: false
      });
    } catch (err) {
      set({ error: (err as any).message, loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await API.get(`/products/${id}`);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: (err as any).message });
      return null;
    }
  },

  fetchCategories: async () => {
    if (get().categories.length) return;
    try {
      const res = await API.get("/products/categories");
      set({ categories: res.data });
    } catch (err) {
      // ignore
    }
  }
}));
