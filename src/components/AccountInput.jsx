import React from 'react'
import { useState } from "react";

function AccountInput() {
    const [cloudName, setCloudName] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            const API_URL =
                import.meta.env.MODE === "development"
                    ? "http://localhost:5000/api/send-details"
                    : "https://cloudinary-gallery-app-production.up.railway.app/api/send-details";

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cloudName,
                    apiKey,
                    apiSecret
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            
            // Only reset fields after successful submission
            setCloudName("");
            setApiKey("");
            setApiSecret("");
            
            alert("Cloudinary details submitted successfully!");

        } catch (error) {
            console.error("Error submitting details:", error);
            alert("Failed to submit details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h2>Input Cloudinary Details</h2>
            <div className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cloud Name
                    </label>
                    <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. my-cloud"
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