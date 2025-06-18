import { createContext, useContext, useState } from 'react';
import {
  getCloudinaryData,
  saveCloudinaryData,
  addAccountToStorage,
  updateSessionInStorage,
} from './accountStorage';

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

  // ADD THESE MISSING FUNCTIONS:
  const updateAccount = (accountId, updatedAccountData) => {
    const data = getCloudinaryData();
    const accountIndex = data.accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex !== -1) {
      data.accounts[accountIndex] = { ...data.accounts[accountIndex], ...updatedAccountData };
      saveCloudinaryData(data);
      setAccounts(data.accounts); // Update state
    }
  };

  const deleteAccount = (accountId) => {
    const data = getCloudinaryData();
    data.accounts = data.accounts.filter(acc => acc.id !== accountId);
    delete data.sessions[accountId]; // Also remove any associated sessions
    saveCloudinaryData(data);
    setAccounts(data.accounts); // Update state
    setSessions(data.sessions); // Update sessions state
    
    // If we're deleting the current account, clear it
    if (currentAccount && currentAccount.id === accountId) {
      setCurrentAccount(null);
      setSessionId(null);
    }
  };

  return (
    <CloudinaryContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,    // ADD THIS
        deleteAccount,    // ADD THIS
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