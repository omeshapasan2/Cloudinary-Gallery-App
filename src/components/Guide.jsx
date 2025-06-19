import React from 'react';
import { Cloud, ExternalLink, Eye, Copy, Shield, Key } from 'lucide-react';

function Guide() {
    return (
        <div className="max-h-[70vh] overflow-y-auto pr-2">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">How to Get Cloudinary Credentials</h2>
                <p className="text-sm text-gray-600 mt-1">Follow these steps to find your API credentials</p>
            </div>

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            1
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Access Your Cloudinary Console</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Log in to your Cloudinary account and navigate to the console dashboard.
                            </p>
                            <a 
                                href="https://cloudinary.com/console" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Open Cloudinary Console</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            2
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Navigate to Dashboard</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Once logged in, you'll be on the main dashboard. Look for the <strong>"Account Details"</strong> section at the top of the page.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-xs text-blue-800">
                                    <strong>💡 Tip:</strong> If you can't see the Account Details, make sure you're on the main dashboard page and not in a sub-section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 - Cloud Name */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            3
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <Cloud className="w-4 h-4 text-green-600" />
                                <h3 className="font-semibold text-gray-900">Find Your Cloud Name</h3>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                In the Account Details section, you'll see your <strong>Cloud name</strong> clearly displayed. This is usually a string of letters and numbers.
                            </p>
                            <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Cloud name:</span>
                                    <span className="text-gray-900 font-medium">dxyz123abc</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 4 - API Key */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            4
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <Key className="w-4 h-4 text-orange-600" />
                                <h3 className="font-semibold text-gray-900">Copy Your API Key</h3>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                Right below the Cloud name, you'll find your <strong>API Key</strong>. This is typically a long string of numbers.
                            </p>
                            <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">API Key:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900 font-medium">123456789012345</span>
                                        <Copy className="w-3 h-3 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 5 - API Secret */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            5
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <Shield className="w-4 h-4 text-red-600" />
                                <h3 className="font-semibold text-gray-900">Reveal Your API Secret</h3>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                The <strong>API Secret</strong> is hidden by default for security. Click the <strong>"Click to reveal"</strong> link or the eye icon to show it.
                            </p>
                            <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">API Secret:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-400">••••••••••••••••</span>
                                        <Eye className="w-3 h-3 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-xs text-red-800">
                                    <strong>🔒 Security Note:</strong> Keep your API Secret private and never share it publicly. It provides full access to your Cloudinary account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Additional Tips</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>You can copy each credential by clicking the copy button next to it</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>If you don't have a Cloudinary account, you can <a href="https://cloudinary.com/users/register/free" target="_blank" rel="noopener noreferrer" className="underline font-medium">sign up for free</a></span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Free accounts include 25 monthly credits and 25GB of storage</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>You can regenerate your API Secret if needed from the same dashboard</span>
                        </li>
                    </ul>
                </div>

                {/* Troubleshooting */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>Troubleshooting</span>
                    </h3>
                    <div className="space-y-3 text-sm text-yellow-800">
                        <div>
                            <p className="font-medium">Can't find the Account Details section?</p>
                            <p>Make sure you're logged in and on the main dashboard. Try refreshing the page or clearing your browser cache.</p>
                        </div>
                        <div>
                            <p className="font-medium">API Secret won't reveal?</p>
                            <p>Some browser extensions might block this. Try disabling ad blockers or use an incognito window.</p>
                        </div>
                        <div>
                            <p className="font-medium">Need help?</p>
                            <p>Contact <a href="https://support.cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Cloudinary Support</a> for additional assistance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Guide;