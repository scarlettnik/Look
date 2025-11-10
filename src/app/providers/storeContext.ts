import { createContext, useContext } from 'react';

import type { RootStore } from '../stores/rootStore';

export const StoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('StoreContext is not available');
  }

  return store;
};

export const useAuth = () => {
  const { authStore } = useStore();

  return {
    user: authStore.user,
    collections: authStore.collections,
    preferences: authStore.preferences,
    isLoading: authStore.isLoading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    savePreferences: authStore.savePreferences,
    deleteAccount: authStore.deleteAccount,
  };
};
