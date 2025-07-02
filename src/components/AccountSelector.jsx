import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiLoader, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useCloudinary } from '../core/CloudinaryContext';

function AccountSelector({ onClose }) {
  const {
    accounts,
    setCurrentAccount,
    updateSession,
    setSessionId,
    updateAccount,
    deleteAccount,
  } = useCloudinary();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({
    label: '',
    cloudName: '',
    apiKey: '',
    apiSecret: ''
  });

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://cg.omeshapasan.site'
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
        onClose();
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

  const handleEdit = (account) => {
    setEditingAccount(account.id);
    setEditForm({
      label: account.label || '',
      cloudName: account.cloudName,
      apiKey: account.apiKey,
      apiSecret: account.apiSecret
    });
  };

  const handleSaveEdit = () => {
    const updatedAccount = {
      ...accounts.find(acc => acc.id === editingAccount),
      ...editForm
    };

    updateAccount(editingAccount, updatedAccount);
    
    setEditingAccount(null);
    setEditForm({ label: '', cloudName: '', apiKey: '', apiSecret: '' });
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditForm({ label: '', cloudName: '', apiKey: '', apiSecret: '' });
  };

  // Fixed: This should only set the delete confirmation state
  const handleDelete = (accountId) => {
    setDeleteConfirm(accountId);
  };

  // Fixed: This actually performs the delete
  const confirmDelete = () => {
    deleteAccount(deleteConfirm);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Cloudinary Accounts
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </div>
          )}

          {accounts.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                No accounts available. Please add an account first.
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {editingAccount === account.id ? (
                    // Edit Form
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={editForm.label}
                            onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Account Label"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cloud Name
                          </label>
                          <input
                            type="text"
                            value={editForm.cloudName}
                            onChange={(e) => setEditForm({ ...editForm, cloudName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Cloud Name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            API Key
                          </label>
                          <input
                            type="text"
                            value={editForm.apiKey}
                            onChange={(e) => setEditForm({ ...editForm, apiKey: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="API Key"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            API Secret
                          </label>
                          <input
                            type="password"
                            value={editForm.apiSecret}
                            onChange={(e) => setEditForm({ ...editForm, apiSecret: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="API Secret"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
                          >
                            <FiX className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : deleteConfirm === account.id ? (
                    // Delete Confirmation
                    <div className="p-4 bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center gap-3 mb-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 dark:text-red-300 font-medium">
                          Delete "{account.label || account.cloudName}"?
                        </span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                        This action cannot be undone. All associated sessions will be removed.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={confirmDelete}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal Account Display
                    <div className="flex items-center justify-between p-4">
                      <button
                        onClick={() => handleSelect(account)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {account.label || account.cloudName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {account.cloudName}
                          </div>
                        </div>
                        {isLoading && (
                          <FiLoader className="w-4 h-4 animate-spin text-gray-500" />
                        )}
                      </button>
                      
                      <div className="flex items-center gap-1 ml-3">
                        <button
                          onClick={() => handleEdit(account)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit account"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(account.id)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete account"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    
  );
}

export default AccountSelector;