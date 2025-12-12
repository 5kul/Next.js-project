import {create} from "zustand";
import API from "../app/lib/api.js";


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
      let url = `/api/users?limit=${limit}&skip=${page * limit}`;

      if (search) {
        url = `/api/users/search?q=${encodeURIComponent(search)}`;
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
    } catch (err) {
      set({ error: (err as any).message, loading: false });
    }
  },

  fetchSingleUser: async (id) => {
    set({ loading: true });
    try {
      const res = await API.get(`/api/users/${id}`);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: (err as any).message });
      return null;
    }
  }
}));
