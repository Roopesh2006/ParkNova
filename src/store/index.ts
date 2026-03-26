import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  role: 'admin' | 'operator' | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user, role: user?.role || null }),
  logout: () => set({ user: null, role: null }),
}));

interface AppState {
  currentPlaceId: string;
  setCurrentPlaceId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPlaceId: 'all',
  setCurrentPlaceId: (id) => set({ currentPlaceId: id }),
}));
