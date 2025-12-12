import {create} from "zustand";
import API from "../_app_back/lib/api.js";

type UsersState = {
  users: any[]; 
  total: number;
  page: number; 
  limit: number;
  loading: boolean;
  error?: string | null;
  cacheTimestamp?: number;

  fetchUsers: (opts?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchSingleUser: (id: number) => Promise<any>;
};

// DummyJSON base URL define karein
const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  page: 0,
  limit: 10,
  loading: false,
  cacheTimestamp: undefined,
  error: null,

  fetchUsers: async ({ page = 0, limit = 10, search } = {}) => {
    const now = Date.now();
    const cacheAge = now - (get().cacheTimestamp || 0);
    const isSamePage = page === get().page && limit === get().limit;

    if (get().users.length && isSamePage && cacheAge < 5 * 60 * 1000 && !search) return;

    set({ loading: true, error: null });

    try {
      // DummyJSON ke liye URL build karein
      let url: string;
      
      if (search) {
        // Search ke liye endpoint
        url = `${DUMMYJSON_BASE_URL}/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${page * limit}`;
      } else {
        // Normal users list ke liye
        url = `${DUMMYJSON_BASE_URL}/users?limit=${limit}&skip=${page * limit}`;
      }

      const res = await API.get(url);

      set({
        users: res.data.users || res.data,
        total: res.data.total || res.data.length,
        page,
        limit,
        loading: false,
        cacheTimestamp: Date.now()
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message, 
        loading: false 
      });
    }
  },

  fetchSingleUser: async (id) => {
    set({ loading: true });
    try {
      // Single user ke liye bhi base URL add karein
      const res = await API.get(`${DUMMYJSON_BASE_URL}/users/${id}`);
      set({ loading: false });
      return res.data;
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.response?.data?.message || err.message 
      });
      return null;
    }
  }
}));