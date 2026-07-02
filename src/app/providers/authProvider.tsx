import { PropsWithChildren, useEffect } from 'react';

import { useStore } from './storeContext';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { authStore, catalogMetadataStore, catalogStore } = useStore();

  useEffect(() => {
    let isCancelled = false;

    const bootstrap = async () => {
      await authStore.initialize();

      if (isCancelled || authStore.error || !authStore.isAuthenticated) {
        return;
      }

      await Promise.all([
        catalogMetadataStore.ensureLoaded(),
        catalogStore.fetchCards(true),
      ]);
    };

    void bootstrap();

    return () => {
      isCancelled = true;
    };
  }, [authStore, catalogMetadataStore, catalogStore]);

  return <>{children}</>;
};
