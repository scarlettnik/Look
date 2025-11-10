import { PropsWithChildren, useState } from 'react';

import { RootStore } from '../stores/rootStore';
import { StoreContext } from './storeContext';

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => new RootStore());

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
