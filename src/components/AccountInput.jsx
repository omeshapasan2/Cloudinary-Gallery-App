import React from 'react'
import { useState } from "react";
import { useCloudinary } from '../core/CloudinaryContext';
import { Save, Eye, EyeOff, Cloud } from "lucide-react";

function AccountInput() {
    const [isLoading, setIsLoading] = useState(false);
    const [label, setLabel] = useState('');
    const [cloudName, setCloudName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [showSecret, setShowSecret] = useState(false);

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

    const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-400";
    const labelClasses = "block text-sm font-medium text-gray-900 mb-2";

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Add Cloudinary Account</h2>
                <p className="text-sm text-gray-600 mt-1">Enter your Cloudinary credentials to get started</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
                {/* Label Field */}
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <label className={labelClasses}>
                        Account Label
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Personal Cloudinary Account"
                        className={inputClasses}
                        disabled={isLoading}
                    />
                </div>

                {/* Cloud Name Field */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <label className={labelClasses}>
                        Cloud Name
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. abcxyz123"
                        className={inputClasses}
                        disabled={isLoading}
                    />
                </div>

                {/* API Key Field */}
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <label className={labelClasses}>
                        API Key
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className={inputClasses}
                        disabled={isLoading}
                    />
                </div>

                {/* API Secret Field */}
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <label className={labelClasses}>
                        API Secret
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showSecret ? "text" : "password"}
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            placeholder="•••••••••••"
                            className={`${inputClasses} pr-12`}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            disabled={isLoading}
                        >
                            {showSecret ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !cloudName || !apiKey || !apiSecret}
                        className={`
                            w-full px-6 py-3 font-medium rounded-lg transition-all duration-300 transform
                            flex items-center justify-center space-x-2
                            ${isLoading || !cloudName || !apiKey || !apiSecret
                                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95 hover:shadow-lg'
                            }
                            ${isLoading ? 'animate-pulse' : ''}
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                        `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Account</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Help Text */}
                <div className="p-3 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <p className="text-xs text-gray-600 text-center">
                        Find your credentials in your{' '}
                        <a 
                            href="https://cloudinary.com/console" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-black hover:underline font-medium"
                        >
                            Cloudinary Console
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}

export default AccountInput;