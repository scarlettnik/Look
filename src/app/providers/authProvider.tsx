import { PropsWithChildren, useEffect } from 'react';

import { useStore } from './storeContext';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { authStore, catalogMetadataStore, catalogStore } = useStore();

  useEffect(() => {
    void authStore.initialize();
    void catalogMetadataStore.ensureLoaded();
    void catalogStore.fetchCards(true);
  }, [authStore, catalogMetadataStore, catalogStore]);

  return <>{children}</>;
};
