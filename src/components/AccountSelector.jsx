import React, { useState } from 'react';
import { useCloudinary } from '../core/CloudinaryContext';

function AccountSelector({ onClose }) {
  const {
    accounts,
    setCurrentAccount,
    updateSession,
    setSessionId,
  } = useCloudinary();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://cloudinary-gallery-app-production.up.railway.app'
    : 'http://localhost:5000';

  const handleSelect = async (account) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudName: account.cloudName,
          apiKey: account.apiKey,
          apiSecret: account.apiSecret,
        }),
      });

      const data = await response.json();
      if (response.ok && data.sessionId) {
        setCurrentAccount(account);
        updateSession(account.id, data.sessionId);
        // setSessionId(data.sessionId);
        onClose(); // Close the modal on successful selection
      } else {
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError('Failed to connect with this account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg max-w-md w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Select Cloudinary Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {accounts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No accounts available. Please add an account first.
        </p>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSelect(account)}
              disabled={isLoading}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg
                border border-gray-200 dark:border-gray-700
                text-gray-900 dark:text-white
                hover:bg-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-gray-500
                transition-all duration-200
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-sm font-medium">
                {account.label || account.cloudName}
              </span>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-gray-500 dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="
            px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-gray-100 dark:bg-gray-800 rounded-lg
            hover:bg-gray-200 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-gray-500
            transition-all duration-200
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AccountSelector;