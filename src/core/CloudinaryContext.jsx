import { createContext, useContext, useState, useEffect } from 'react';
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

  const [currentAccount, setCurrentAccount] = useState(() => {
    const saved = localStorage.getItem('currentAccount');
    return saved ? JSON.parse(saved) : null;
  });

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('sessionId') || null;
  });

  // 🔁 Persist currentAccount to localStorage
  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem('currentAccount');
    }
  }, [currentAccount]);

  // 🔁 Persist sessionId to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

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

  const updateAccount = (accountId, updatedAccountData) => {
    const data = getCloudinaryData();
    const accountIndex = data.accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex !== -1) {
      data.accounts[accountIndex] = { ...data.accounts[accountIndex], ...updatedAccountData };
      saveCloudinaryData(data);
      setAccounts(data.accounts);
    }
  };

  const deleteAccount = (accountId) => {
    const data = getCloudinaryData();
    data.accounts = data.accounts.filter(acc => acc.id !== accountId);
    delete data.sessions[accountId];
    saveCloudinaryData(data);
    setAccounts(data.accounts);
    setSessions(data.sessions);

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
        updateAccount,
        deleteAccount,
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
