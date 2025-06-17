import React from 'react'
import { useState } from "react";
import { useCloudinary } from '../core/CloudinaryContext';

function AccountInput() {
    const [isLoading, setIsLoading] = useState(false);
    const [label, setLabel] = useState('');
    const [cloudName, setCloudName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');

    const { addAccount } = useCloudinary();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const newAccount = {
                id: crypto.randomUUID(),
                label,
                cloudName,
                apiKey,
                apiSecret
            };

            addAccount(newAccount);
            alert('Account saved!');
            
            // clear form
            setLabel('');
            setCloudName('');
            setApiKey('');
            setApiSecret('');

        } catch (err) {
            console.error("Error saving account:", err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <h2>Input Cloudinary Details</h2>
            <div className="mt-4 space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Label
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Personal Cloudinary Account"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cloud Name
                    </label>
                    <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. abcxyz123"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        API Key
                    </label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        API Secret
                    </label>
                    <input
                        type="password"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="•••••••••••"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                        disabled={isLoading}
                    />
                </div>
            </div>
            
            <footer className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !cloudName || !apiKey || !apiSecret}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </footer>
        </div>
    )
}

export default AccountInput