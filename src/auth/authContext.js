import { createContext, useContext } from 'react';

export const AuthContext = createContext({ status: 'unknown', setStatus: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}
