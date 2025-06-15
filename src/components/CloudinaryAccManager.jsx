import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Settings } from 'lucide-react';

const CloudinaryAccManager = ({ onAccountSelect, currentAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cloudName: '',
    apiKey: '',
    apiSecret: '',
    uploadPreset: '',
    folder: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem('cloudinaryAccounts');
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts);
      
      // Set first account as current if none selected
      if (parsedAccounts.length > 0 && !currentAccount) {
        onAccountSelect(parsedAccounts[0]);
      }
    }
  };

  const saveAccounts = (accountsList) => {
    localStorage.setItem('cloudinaryAccounts', JSON.stringify(accountsList));
    setAccounts(accountsList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAccount) {
      // Update existing account
      const updatedAccounts = accounts.map(account =>
        account.id === editingAccount.id ? { ...formData, id: editingAccount.id } : account
      );
      saveAccounts(updatedAccounts);
      setEditingAccount(null);
    } else {
      // Add new account
      const newAccount = {
        ...formData,
        id: Date.now().toString()
      };
      const updatedAccounts = [...accounts, newAccount];
      saveAccounts(updatedAccounts);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cloudName: '',
      apiKey: '',
      apiSecret: '',
      uploadPreset: '',
      folder: ''
    });
    setShowAddForm(false);
    setEditingAccount(null);
  };

  const handleEdit = (account) => {
    setFormData(account);
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const handleDelete = (accountId) => {
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    saveAccounts(updatedAccounts);
    
    // If deleted account was current, select first available or null
    if (currentAccount && currentAccount.id === accountId) {
      onAccountSelect(updatedAccounts.length > 0 ? updatedAccounts[0] : null);
    }
  };

  const handleAccountSelect = (account) => {
    onAccountSelect(account);
    setShowManager(false);
  };

  return (
    <div className="mb-6">
      {/* Current Account Display & Manager Toggle */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Current Account: {currentAccount ? currentAccount.name : 'No account selected'}
          </h3>
          {currentAccount && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cloud: {currentAccount.cloudName} | Folder: {currentAccount.folder}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowManager(!showManager)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Settings size={16} />
          <span>Manage Accounts</span>
        </button>
      </div>

      {/* Account Manager */}
      {showManager && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Cloudinary Accounts
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus size={16} />
              <span>Add Account</span>
            </button>
          </div>

          {/* Accounts List */}
          <div className="space-y-2 mb-4">
            {accounts.map(account => (
              <div
                key={account.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  currentAccount && currentAccount.id === account.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleAccountSelect(account)}
              >
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {account.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {account.cloudName} / {account.folder}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(account);
                    }}
                    className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(account.id);
                    }}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {accounts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No accounts configured. Add your first Cloudinary account to get started.
            </p>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="My Cloudinary Account"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      value={formData.cloudName}
                      onChange={(e) => setFormData({...formData, cloudName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="your-cloud-name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="123456789012345"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="your-api-secret"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload Preset
                    </label>
                    <input
                      type="text"
                      value={formData.uploadPreset}
                      onChange={(e) => setFormData({...formData, uploadPreset: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="your-upload-preset"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Folder
                    </label>
                    <input
                      type="text"
                      value={formData.folder}
                      onChange={(e) => setFormData({...formData, folder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
                      placeholder="my-folder"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Check size={16} />
                    <span>{editingAccount ? 'Update' : 'Add'} Account</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryAccManager;