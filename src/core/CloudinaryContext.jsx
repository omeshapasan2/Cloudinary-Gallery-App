import { createContext, useContext, useState } from 'react';
import {
  getCloudinaryData,
  saveCloudinaryData,
  addAccountToStorage,
  updateSessionInStorage,
} from './accountStorage';

// 🟢 Rename to avoid name conflict
const CloudinaryContext = createContext();

export function CloudinaryProvider({ children }) {
  const [accounts, setAccounts] = useState(() => getCloudinaryData().accounts);
  const [sessions, setSessions] = useState(() => getCloudinaryData().sessions);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const addAccount = (account) => {
    addAccountToStorage(account);
    const updated = getCloudinaryData().accounts;
    setAccounts(updated);
  };

  const updateSession = (accountId, newSessionId) => {
    updateSessionInStorage(accountId, newSessionId);
    const updated = getCloudinaryData().sessions;
    setSessions(updated);
    setSessionId(newSessionId);
  };

  return (
    <CloudinaryContext.Provider
      value={{
        accounts,
        addAccount,
        currentAccount,
        setCurrentAccount,
        sessionId,
        setSessionId,
        updateSession,
        sessions,
      }}
    >
      {children}
    </CloudinaryContext.Provider>
  );
}

export function useCloudinary() {
  return useContext(CloudinaryContext);
}