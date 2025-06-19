import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CopyButton from '../components/CopyButton';
import { useCloudinary } from '../core/CloudinaryContext';
import ImageCard from '../components/ImageCard';
import { NavBar } from '../components/NavBar';
import { RefreshCw } from "lucide-react";

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get sessionId and currentAccount from context
  const { sessionId, currentAccount, sessions } = useCloudinary();

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://cloudinary-gallery-app-production.up.railway.app' 
    : 'http://localhost:5000';

  // Get the active session ID (either from context or from sessions based on current account)
  const getActiveSessionId = () => {
    if (sessionId) return sessionId;
    if (currentAccount && sessions[currentAccount.id]) {
      return sessions[currentAccount.id];
    }
    return null;
  };

  // Fetch images from the server using sessionId
  const fetchImages = async () => {
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cloudinary`, {
        sessionId: activeSessionId
      });
      
      setImages(response.data.resources || []);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to fetch images. Please check your account connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images when sessionId or currentAccount changes
  useEffect(() => {
    const activeSessionId = getActiveSessionId();
    if (activeSessionId) {
      fetchImages();
    }
  }, [sessionId, currentAccount]);

  const activeSessionId = getActiveSessionId();

  return (
    <div className="space-y-6">
      <NavBar/>
        {/* Account Status Section */}
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-14 flex items-center justify-between">
              {currentAccount && activeSessionId ? (
                <>
                  {/* Left side - Status */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                        Connected to {currentAccount.label || currentAccount.cloudName}
                      </span>
                      <span className="text-sm font-medium text-gray-900 sm:hidden">
                        Connected
                      </span>
                    </div>
                  </div>
                  
                  {/* Right side - Refresh button */}
                  <button
                    onClick={fetchImages}
                    disabled={isLoading}
                    className="group relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    title="Refresh Gallery"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 transition-transform duration-500 ${
                        isLoading ? 'animate-spin' : 'group-hover:rotate-180'
                      }`} 
                    />
                    {/* Subtle loading indicator */}
                    {isLoading && (
                      <div className="absolute inset-0 rounded-full border border-gray-300 animate-pulse"></div>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2 w-full">
                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="hidden sm:inline">No account selected. Please select an account to view your gallery.</span>
                    <span className="sm:hidden">No account selected</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Subtle bottom accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl mx-auto p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading images...</span>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {!isLoading && images.length > 0 && activeSessionId && (
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Cloudinary Gallery ({images.length} images)
            </h3>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {images.map((image) => (
              <ImageCard key={image.public_id} image={image} onActionComplete={fetchImages}/>
            ))}
          </div>
        </div>
      )}

      {/* No Images State - only show if we have a session but no images */}
      {!isLoading && images.length === 0 && !error && activeSessionId && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="space-y-2">
            <p className="text-lg">No images found in your Cloudinary account.</p>
            <p className="text-sm">Upload some images first to see them here!</p>
          </div>
        </div>
      )}

      {/* No Account Selected State */}
      {!activeSessionId && !isLoading && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <div className="text-6xl">📷</div>
            <div className="space-y-2">
              <p className="text-xl font-medium">Ready to view your gallery?</p>
              <p className="text-sm">Select a Cloudinary account to load your images.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;